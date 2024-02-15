CREATE TABLE PostalCodes (
  PostalCodeID INT PRIMARY KEY AUTO_INCREMENT,
  PostalCode CHAR(7) UNIQUE NOT NULL,
  City VARCHAR(255) NOT NULL,
  Province VARCHAR(255) NOT NULL
);

CREATE TABLE Facilities (
  FacilityID INT PRIMARY KEY AUTO_INCREMENT,
  Name VARCHAR(255) NOT NULL,
  Type VARCHAR(255) NOT NULL,
  Capacity INT NOT NULL,
  WebAddress VARCHAR(255) UNIQUE,
  PhoneNumber VARCHAR(255) UNIQUE NOT NULL,
  Address VARCHAR(255),
  PostalCodeID INT,
  FOREIGN KEY (PostalCodeID) REFERENCES PostalCodes(PostalCodeID),
  CHECK (Type in ('Hospital', 'CLSC', 'Clinic', 'Pharmacy', 'Special instalment'))
);

CREATE TABLE Employees (
  EmployeeID INT PRIMARY KEY AUTO_INCREMENT,
  FName VARCHAR(255),
  LName VARCHAR(255),
  Role VARCHAR(255),
  DoBirth DATE,
  MedicareNumber VARCHAR(255) NOT NULL UNIQUE,
  Email VARCHAR(255) UNIQUE,
  Citizenship VARCHAR(255),
  PhoneNumber VARCHAR(255) NOT NULL UNIQUE,
  Address VARCHAR(255),
  PostalCodeID INT,
  FOREIGN KEY (PostalCodeID) REFERENCES PostalCodes(PostalCodeID),
  CHECK (Role IN ('Nurse', 'Doctor', 'Cashier', 'Pharmacist', 'Receptionist', 'Administrative personnel', 'Security personnel', 'Regular employee'))
);

CREATE TABLE Employment (
  EmploymentID INT PRIMARY KEY AUTO_INCREMENT,
  FacilityID INT NOT NULL,
  EmployeeID INT NOT NULL,
  ContractID INT UNIQUE NOT NULL,
  StartDate DATE NOT NULL,
  EndDate DATE,
  UNIQUE (FacilityID, EmployeeID, ContractID),
  FOREIGN KEY (FacilityID) REFERENCES Facilities(FacilityID),
  FOREIGN KEY (EmployeeID) REFERENCES Employees(EmployeeID),
  CHECK (EndDate IS NULL OR EndDate > StartDate)
);

CREATE TABLE Managers (
  ManagerID INT PRIMARY KEY AUTO_INCREMENT,
  FacilityID INT,
  EmployeeID INT,
  StartDate DATE NOT NULL,
  EndDate DATE,
  UNIQUE (FacilityID, EmployeeID, StartDate),
  FOREIGN KEY (FacilityID, EmployeeID) REFERENCES Employment(FacilityID, EmployeeID),
  CHECK (EndDate IS NULL OR EndDate > StartDate)
);

CREATE TABLE Vaccines (
  VaccineID INT PRIMARY KEY AUTO_INCREMENT,
  EmployeeID INT,
  FacilityID INT,
  Type VARCHAR(255),
  DoseNumber INT,
  Date DATE,
  UNIQUE (EmployeeID, DoseNumber),
  FOREIGN KEY (EmployeeID) REFERENCES Employees(EmployeeID),
  FOREIGN KEY (FacilityID) REFERENCES Facilities(FacilityID),
  CHECK (Type IN ('Pfizer', 'Moderna', 'AstraZeneca', 'Johnson & Johnson'))
);

CREATE TABLE Infections (
  InfectionID INT PRIMARY KEY AUTO_INCREMENT,
  EmployeeID INT,
  Type VARCHAR(255),
  Date DATE,
  FOREIGN KEY (EmployeeID) REFERENCES Employees(EmployeeID)
);

CREATE TABLE Schedule (
  ScheduleID INT PRIMARY KEY AUTO_INCREMENT,
  FacilityID INT,
  EmployeeID INT,
  Date DATE,
  StartTime TIME,
  EndTime TIME,
  UNIQUE (FacilityID, EmployeeID, Date, StartTime),
  FOREIGN KEY (FacilityID, EmployeeID) REFERENCES Employment(FacilityID, EmployeeID),
  CHECK (EndTime >= StartTime)
);

CREATE TABLE EmailLog (
  EmailLogID INT PRIMARY KEY AUTO_INCREMENT,
  FacilityID INT,
  EmployeeID INT,
  Date DATE,
  Subject VARCHAR(255),
  Body TEXT,
  UNIQUE (FacilityID, EmployeeID, Date),
  FOREIGN KEY (FacilityID, EmployeeID) REFERENCES Employment(FacilityID, EmployeeID)
);

DELIMITER $$
CREATE TRIGGER AddingEmployeeExceedCapacityFacility
BEFORE INSERT ON Employment
FOR EACH ROW
BEGIN
    DECLARE CapacityOfFacility INT;
    DECLARE CurrentCount INT;
    SET CapacityOfFacility  = (SELECT Capacity FROM Facilities WHERE FacilityID = NEW.FacilityID);
    SET CurrentCount = (SELECT COUNT(EmployeeID) FROM Employment WHERE FacilityID = NEW.FacilityID);
    
    IF (CurrentCount >= CapacityOfFacility) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot assign this employee to the facility. The facility has reached its maximum capacity.';
    END IF;
END;$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER ManagerIsAdministrativePersonnel
BEFORE INSERT ON Managers
FOR EACH ROW
BEGIN
  IF NOT EXISTS (
    SELECT*
    FROM Employees
    WHERE EmployeeID = NEW.EmployeeID AND Role = 'Administrative personnel'
  ) THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Employee must be Administrative personnel to be a Manager';
  END IF;
END; $$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER CheckScheduleConflict 
BEFORE INSERT  ON Schedule 
FOR EACH ROW 
BEGIN 
  IF EXISTS (SELECT * FROM Schedule 
             WHERE EmployeeID = NEW.EmployeeID AND
			             Date = NEW.Date AND
			            ((StartTime <= NEW.StartTime AND EndTime >= NEW.StartTime) OR 
                  (StartTime >= NEW.StartTime AND StartTime <= NEW.EndTime))) 
  THEN 
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Employee is scheduled at a conflicting time'; 
  END IF; 
END;$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER CheckTimeIntervalSchedule BEFORE INSERT  ON Schedule
FOR EACH ROW
BEGIN
  IF EXISTS (SELECT * FROM Schedule
             WHERE EmployeeId = NEW.EmployeeId
             AND Date = NEW.Date
             AND ((StartTime <= NEW.StartTime AND EndTime > NEW.StartTime - INTERVAL 1 HOUR)
                  OR (StartTime >= New.StartTime AND StartTime < NEW.EndTime + INTERVAL 1 HOUR))) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Employee is scheduled with less than 1 hour interval';
  END IF;
END;$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER FourWeekSchedule
BEFORE INSERT  ON Schedule
FOR EACH ROW
BEGIN
  IF NEW.Date > (NOW() + INTERVAL 4 WEEK) THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Cannot schedule more than four weeks ahead of time.';
  END IF;
END;$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER CancelAssignments
AFTER INSERT  ON Infections
FOR EACH ROW
BEGIN
    DECLARE EmpType VARCHAR(255);
    DECLARE InfectedDate DATE;
    -- Get employee type and latest infected date from the newly inserted row
    SET EmpType = (SELECT e.Role FROM Employees e WHERE e.EmployeeID = NEW.EmployeeID);
    SET InfectedDate = (
        SELECT MAX(i.Date) 
        FROM Infections i 
        WHERE i.EmployeeID = NEW.EmployeeID AND i.Type = 'COVID-19'
    );
    -- Check if the infected employee is a doctor or a nurse
    IF EmpType IN ('Nurse', 'Doctor') AND InfectedDate IS NOT NULL THEN
        -- Cancel all assignments for the infected employee for two weeks
        DELETE 
        FROM Schedule 
        WHERE EmployeeID = NEW.EmployeeID AND 
              Date >= InfectedDate AND 
              Date < DATE_ADD(InfectedDate, INTERVAL 14 DAY);
    END IF;
END; $$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER CheckEmployeeVaccinationCovid 
BEFORE INSERT  ON Schedule
FOR EACH ROW
BEGIN
  DECLARE VaccinationDate DATE;
  SET VaccinationDate = (
    SELECT MAX(Date) FROM Vaccines
    WHERE EmployeeID = NEW.EmployeeID AND
	    (Type='Pfizer' OR Type='Moderna' OR Type='AstraZeneca' OR Type='Johnson & Johnson') AND
	    Date BETWEEN DATE_SUB(NEW.Date, INTERVAL 6 MONTH) AND NEW.Date
  );
  IF VaccinationDate IS NULL THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Employee is not vaccinated against COVID-19 in the past six months. Employee can not be scheduled.';
  END IF;
END;$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER EmailWarningInfectedEmployee
AFTER INSERT  ON Infections
FOR EACH ROW
BEGIN
    DECLARE InfectedEmpType VARCHAR(255);
    DECLARE InfectedDate DATE;
    -- Get employee type and latest infected date from the newly inserted row
    SET InfectedEmpType = (SELECT e.Role FROM Employees e WHERE e.EmployeeID = NEW.EmployeeID);
    SET InfectedDate = (
        SELECT MAX(i.Date) 
        FROM Infections i 
        WHERE i.EmployeeID = NEW.EmployeeID AND i.Type = 'COVID-19'
    );
    -- Check if the infected employee is a doctor or a nurse
    IF InfectedEmpType IN ('Nurse', 'Doctor') AND InfectedDate IS NOT NULL THEN
    
    -- Email warning to inform/track all the doctors and nurses who have been in contact by having the same schedule as the infected employee
		INSERT INTO EmailLog (FacilityID, EmployeeID, Date, Subject, Body)
        SELECT DISTINCT FacilityID, s.EmployeeID, NEW.Date AS Date, 'Warning' AS Subject, 'One of your colleagues that you have worked with in the past two weeks have been infected with COVID-19' AS Body
		    FROM Schedule s, Employees e
		    WHERE s.EmployeeID = e.EmployeeID AND
			  (s.FacilityID IN (SELECT FacilityID FROM Employment em WHERE (em.EmployeeID = NEW.EmployeeID))) AND
			   s.EmployeeID <> NEW.EmployeeID AND
			   e.Role IN ('Nurse', 'Doctor') AND
			   s.Date IN (SELECT Date FROM Schedule WHERE (EmployeeID = NEW.EmployeeID)) AND
               s.Date <= InfectedDate AND 
               s.Date >= DATE_SUB(InfectedDate, INTERVAL 14 DAY) AND
			        s.StartTime = ANY (SELECT StartTime FROM Schedule WHERE (EmployeeID = NEW.EmployeeID AND Date IN (SELECT Date FROM Schedule WHERE (EmployeeID = NEW.EmployeeID)))) AND 
               s.EndTime =  ANY (SELECT EndTime FROM Schedule WHERE (EmployeeID = NEW.EmployeeID AND Date IN (SELECT Date FROM Schedule WHERE (EmployeeID = NEW.EmployeeID))));
    END IF;
END; $$
DELIMITER ;

INSERT INTO PostalCodes (PostalCode, City, Province) VALUES
('H3G 1B3', 'Montreal', 'Quebec'),
('H3G 1Z7', 'Montreal', 'Quebec'),
('H3G 1A1', 'Montreal', 'Quebec'),
('H3G 1R5', 'Montreal', 'Quebec'),
('H3G 2S6', 'Montreal', 'Quebec'),
('H3G 2C2', 'Montreal', 'Quebec'),
('H3G 1J5', 'Montreal', 'Quebec'),
('H3G 1Y2', 'Montreal', 'Quebec'),
('H3G 2G8', 'Brossard', 'Quebec'),
('H3G 1G3', 'Brossard', 'Quebec'),
('X3Y 6S8', 'Toronto', 'Ontario'),
('L2C 4T9', 'Toronto', 'Ontario'),
('H3G 1A7', 'Montreal', 'Quebec'),
('J4X 9T2', 'Brossard', 'Quebec'),
('J5X 4T6', 'Brossard', 'Quebec'),
('N5T 2IE', 'Toronto', 'Ontario'),
('J5T 8G4', 'Toronto', 'Ontario'),
('H3S 1W8', 'Montreal', 'Quebec'),
('H4V 1B8', 'Montreal', 'Quebec'),
('H3J 1C7', 'Montreal', 'Quebec'),
('H6A 1B4', 'Montreal', 'Quebec'),
('H8D 1F3', 'Montreal', 'Quebec'),
('H3S 1W7', 'Montreal', 'Quebec'),
('H4T 1C3', 'Montreal', 'Quebec'),
('H6J 8P5', 'Montreal', 'Quebec'),
('H5G 3S5', 'Montreal', 'Quebec'),
('H9D 5B5', 'Montreal', 'Quebec'),
('G1B 0A9', 'Quebec', 'Quebec'),
('H4T 2X5', 'Montreal', 'Quebec');

INSERT INTO Facilities (Name, Type, Capacity, WebAddress, PhoneNumber, Address, PostalCodeID) VALUES
('Hospital Maisonneuve Rosemont', 'Hospital', 500, 'www.centralhospital.com', '514-555-1234', '123 Main Street', '1'),
('North CLSC', 'CLSC', 200, 'www.northCLSC.com', '514-555-2345', '456 Queen Street', '2'),
('West Pharmacy', 'Pharmacy', 300, 'www.westpharmacy.com', '514-555-3456', '789 King Street', '3'),
('East Hospital', 'Hospital', 400, 'www.easthospital.com', '514-555-4567', '246 College Street', '4'),
('South Special instalment', 'Special instalment', 250, 'www.south.com', '514-555-5678', '369 Bathurst Street', '5'),
('Midtown Hospital', 'Hospital', 450, 'www.midtownhospital.com', '514-555-6789', '159 Spadina Avenue', '6'),
('Downtown CLSC', 'CLSC', 175, 'www.downtownCLSC.com', '514-555-7890', '425 Yonge Street', '7'),
('Uptown Pharmacy', 'Pharmacy', 325, 'www.uptownpharmacy.com', '514-555-8901', '520 Bloor Street', '8'),
('Harbourfront Hospital', 'Hospital', 375, 'www.harbourfronthospital.com', '514-555-9012', '235 Queens Quay West', '9'),
('West End Special instalment', 'Special instalment', 225, 'www.westend.com', '514-555-0123', '867 Queen Street West', '10'),
('General Hospital', 'Hospital', 200, 'www.generalhospital.com', '520-333-1333', '203 Saint-Peter Street', '11'),
('Queen West CLSC', 'CLSC', 100, 'www.queenwestclsc.com', '520-333-9897', '1000 Saint-Louis Street', '12'),
('Downtown Hospital', 'Hospital', 6, 'www.downtownhospital.com', '514-383-9696', '1000 Saint-Antoine Street', '13');

INSERT INTO Employees (FName, LName, Role, DoBirth, MedicareNumber, Email, Citizenship, PhoneNumber, Address, PostalCodeID) VALUES
('John', 'Doe', 'Nurse', '1980-01-01', '123-456-789', 'johndoe@email.com', 'Canadian', '514-555-1234', '123 Main Street', '13'),
('Jane', 'Smith', 'Doctor', '1982-02-15', '234-567-890', 'janesmith@email.com', 'Canadian', '514-555-2345', '456 Queen Street', '13'),
('Bob', 'Johnson', 'Cashier', '1985-03-25', '345-678-901', 'bobjohnson@email.com', 'Canadian', '514-555-3456', '789 King Street', '13'),
('Emily', 'Davis', 'Pharmacist', '1987-04-15', '456-789-012', 'emilydavis@email.com', 'Canadian', '514-555-4567', '246 Main Street', '13'),
('William', 'Brown', 'Receptionist', '1990-05-30', '567-890-123', 'williambrown@email.com', 'Canadian', '514-555-5678', '369 Park Street', '13'),
('Ashley', 'Taylor', 'Administrative personnel', '1992-06-15', '678-901-234', 'ashleytaylor@email.com', 'Canadian', '514-555-6789', '159 Eglinton Avenue', '13'),
('Michael', 'Thomas', 'Security personnel', '1995-07-25', '789-012-345', 'michaelthomas@email.com', 'Canadian', '514-555-7890', '425 Bloor Street', '13'),
('Sarah', 'Moore', 'Regular employee', '1997-08-15', '890-123-456', 'sarahmoore@email.com', 'Canadian', '514-555-8901', '520 Danforth Avenue', '13'),
('David', 'Jackson', 'Nurse', '2000-09-30', '901-234-567', 'davidjackson@email.com', 'Canadian', '514-555-9012', '235 Kingsway', '13'),
('Jessica', 'Miller', 'Doctor', '2002-10-15', '012-345-678', 'jessicamiller@email.com', 'Canadian', '514-555-0123', '867 King Street', '13'),
('Richard', 'Davis', 'Cashier', '1980-11-01', '111-456-789', 'richarddavis@email.com', 'Canadian', '514-555-1112', '456 Park Avenue', '13'),
('Elizabeth', 'Martin', 'Pharmacist', '1982-12-15', '222-567-890', 'elizabethmartin@email.com', 'Canadian', '514-555-2223', '789 Queen Street', '13'),
('Christopher', 'Brown', 'Receptionist', '1985-01-25', '333-678-901', 'christopherbrown@email.com', 'Canadian', '514-555-3334', '246 Main Street', '13'),
('Matthew', 'Taylor', 'Administrative personnel', '1987-02-15', '444-789-012', 'matthewtaylor@email.com', 'Canadian', '514-555-4445', '369 Park Street', '13'),
('Daniel', 'Thomas', 'Security personnel', '1990-03-30', '555-890-123', 'danielthomas@email.com', 'Canadian', '514-555-5556', '159 Eglinton Avenue', '13'),
('Sarah', 'Moore', 'Regular employee', '1992-04-15', '666-901-234', 'sarahmoore1@email.com', 'Canadian', '514-555-6667', '425 Bloor Street', '13'),
('John', 'Davis', 'Doctor', '1995-05-25', '777-012-345', 'johndavis@email.com', 'Canadian', '514-555-7778', '520 Danforth Avenue', '13'),
('Jessica', 'Wilson', 'Nurse', '1997-06-15', '888-123-456', 'jessicawilson@email.com', 'Canadian', '514-555-8889', '235 Kingsway', '13'),
('William', 'Anderson', 'Doctor', '2000-07-30', '999-234-567', 'williamanderson@email.com', 'Canadian', '514-555-9990', '867 King Street', '13'),
('Emily', 'Thomas', 'Nurse', '2002-08-15', '000-345-678', 'emilythomas@email.com', 'Canadian', '514-555-0001', '123 Main Street', '13'),
('John', 'Nguyen', 'Doctor', '1990-01-01', '001-786-278', 'johnnguyen@email.com', 'French', '514-555-2672', '78 Saint-Mary Street', '14'),
('Mary', 'Tran', 'Receptionist', '1980-09-01', '189-298-872', 'marytran@email.com', 'Canadian', '514-555-2872', '728 Saint-Louis Street', '15'),
('Eddy', 'Wang', 'Doctor', '1987-08-10', '020-871-188', 'eddywang@email.com', 'Canadian', '762-265-2982', '22 Saint-Louis Street', '16'),
('Jenny', 'Wang', 'Nurse', '1992-07-11', '782-892-287', 'jennywang@email.com', 'Canadian', '728-892-6721', '192 Saint-Justin Street', '17'),
('Henry', 'Aspen', 'Administrative personnel', '1965-01-01', '128-476-709', 'henryaspen@email.com', 'Canadian', '514-344-1234', '143 Good Street', '18'),
('Judy', 'Chicago', 'Administrative personnel', '1952-02-10', '284-567-830', 'judychicago@email.com', 'Canadian', '514-756-2315', '46 Prince Street', '19'),
('Bob', 'Dylan', 'Administrative personnel', '1978-08-25', '365-658-991', 'bobdylan@email.com', 'Canadian', '514-255-7456', '9 Best Street', '20'),
('David', 'Kwan', 'Administrative personnel', '1964-04-15', '582-779-012', 'davidkwan@email.com', 'Canadian', '514-244-4577', '24 Worst Street', '21'),
('Benjamin', 'Booth', 'Administrative personnel', '1980-05-24', '517-830-133', 'benjaminbooth@email.com', 'Canadian', '514-265-5238', '9 Kent Street', '22'),
('Morgane', 'Dion', 'Administrative personnel', '1982-06-15', '558-911-234', 'morganedion@email.com', 'Canadian', '514-285-5709', '15 Ellendale Avenue', '23'),
('Noemie', 'Duke', 'Administrative personnel', '1975-05-24', '709-002-045', 'noemieduke@email.com', 'Canadian', '514-736-2849', '45 Blood Street', '24'),
('Sarah', 'Lance', 'Administrative personnel', '1976-09-19', '892-173-466', 'sarahlance@email.com', 'Canadian', '514-589-6435', '52 Lake Avenue', '25'),
('Celia', 'Kremer', 'Administrative personnel', '1977-08-24', '911-244-577', 'celiakremer@email.com', 'Canadian', '514-887-625', '25 Bloom Avenue', '26'),
('Dermot', 'Keller', 'Administrative personnel', '1949-11-10', '002-300-688', 'dermotkeller@email.com', 'Canadian', '514-838-6811', '77 Queens Street', '27'),
('Jerome', 'Ferrer', 'Doctor', '1964-09-17', '452-390-675', 'jeromeferrer@email.com', 'Canadian', '514-344-5707', '3275 Champlain Street', '28'),
('Maelle', 'Campagnie', 'Nurse', '1994-09-19', '476-839-905', 'maellecampagnie@email.com', 'Canadian', '514-366-7777', '32 Saint-Paul Street', '13'),
('Clemence', 'Fouquet', 'Nurse', '1993-12-05', '389-756-832', 'clemencefouquet@email.com', 'Canadian', '514-855-3669', '5 Grace Street', '27'),
('Nadira', 'Rafai', 'Nurse', '1984-08-07', '568-934-835', 'nadirarafai@email.com', 'Canadian', '514-865-3778', '27 Martin Street', '24'),
('Anais', 'Perez', 'Nurse', '1992-01-27', '962-038-285', 'anaisperez@email.com', 'Canadian', '514-438-4927', '75 Marie Street', '19'),
('David', 'Klein', 'Receptionist', '1952-04-23', '341-528-491', 'davidklein@email.com', 'Canadian', '514-684-5328', '11 Rockland Street', '18'),
('Thomas', 'Roy', 'Administrative personnel', '1978-05-24', '234-619-502', 'thomas@roy.com', 'Canadian', '514-684-5329', '12 Rockland Street', '18');

INSERT INTO Employment (FacilityID, EmployeeID, ContractID, StartDate, EndDate) VALUES
(1, 1, 1, '2022-12-01', NULL),
(2, 2, 2, '2022-12-02', NULL),
(3, 3, 3, '2022-12-03', NULL),
(4, 4, 4, '2022-12-04', NULL),
(5, 5, 5, '2022-12-05', NULL),
(6, 6, 6, '2022-12-06', NULL),
(7, 7, 7, '2022-12-07', NULL),
(8, 8, 8, '2022-12-08', NULL),
(9, 9, 9, '2022-12-09', NULL),
(10, 10, 10, '2022-12-10', NULL),
(1, 11, 11, '2022-12-11', NULL),
(2, 12, 12, '2022-12-12', NULL),
(3, 13, 13, '2022-12-13', NULL),
(4, 14, 14, '2022-12-14', NULL),
(5, 15, 15, '2022-12-15', NULL),
(6, 16, 16, '2022-12-16', NULL),
(7, 17, 17, '2022-12-17', NULL),
(8, 18, 18, '2022-12-18', NULL),
(9, 19, 19, '2022-12-19', '2023-02-11'),
(11, 1, 21, "2021-01-01", "2022-11-01"),
(12, 4, 22, "2020-12-15", "2022-11-15"),
(1, 21, 23, "2020-01-01", null),
(1, 22, 24, "2021-12-03", null),
(11, 23, 25, "2020-01-02", null),
(12, 24, 26, "2022-01-02", null),
(1, 14, 27, '2023-01-01', NULL),
(2, 25, 28, '2023-01-02', NULL),
(2, 1, 29, '2023-01-03', NULL),
(2, 3, 30, '2023-01-04', NULL),
(3, 26, 31, '2023-01-05', NULL),
(3, 1, 32, '2023-01-06', NULL),
(3, 2, 33, '2023-01-07', NULL),
(4, 27, 34, '2023-01-08', NULL),
(4, 1, 35, '2023-01-09', NULL),
(4, 2, 36, '2023-01-10', NULL),
(5, 28, 37, '2023-01-11', NULL),
(5, 2, 38, '2023-01-12', NULL),
(5, 3, 39, '2023-01-13', NULL),
(6, 3, 40, '2023-01-14', NULL),
(6, 4, 41, '2023-01-15', NULL),
(6, 5, 42, '2023-01-16', NULL),
(7, 29, 43, '2023-01-17', NULL),
(7, 4, 44, '2023-01-18', NULL),
(7, 5, 45, '2023-01-19', NULL),
(8, 30, 46, '2023-01-20', NULL),
(8, 4, 47, '2023-01-21', NULL),
(8, 5, 48, '2023-01-22', NULL),
(9, 31, 49, '2023-01-23', NULL),
(9, 6, 50, '2023-01-24', NULL),
(9, 7, 51, '2023-01-25', NULL),
(9, 8, 52, '2023-01-26', NULL),
(10, 32, 53, '2023-01-27', NULL),
(10, 6, 54, '2023-01-28', NULL),
(10, 7, 55, '2023-01-29', NULL),
(10, 8, 56, '2023-01-30', NULL),
(11, 33, 57, '2023-01-31', NULL),
(11, 6, 58, '2023-02-01', NULL),
(11, 7, 59, '2023-02-02', NULL),
(11, 8, 60, '2023-02-03', NULL),
(12, 34, 61, '2023-02-04', NULL),
(12, 9, 62, '2023-02-05', NULL),
(12, 10, 63, '2023-02-06', NULL),
(12, 11, 64, '2023-02-07', NULL),
(10, 19, 65, '2023-02-12', NULL),
(6, 35, 66, '2022-12-01', NULL),
(13, 20, 67, '2023-02-13', NULL),
(13, 36, 68, '2021-01-01', NULL),
(13, 37, 69, '2021-01-01', NULL),
(13, 38, 70, '2021-01-01', NULL),
(13, 39, 71, '2021-01-01', NULL),
(1, 40, 72, '2023-01-01', NULL),
(13, 41, 73, '2008-01-01', NULL),
(2, 9, 74, '2001-01-01', NULL),
(2, 17, 75, '2015-01-01', NULL);

INSERT INTO Managers (FacilityID, EmployeeID, StartDate, EndDate) VALUES
(1, 14, '2022-12-01', NULL),
(2, 25, '2022-12-02', NULL),
(3, 26, '2022-12-03', NULL),
(4, 27, '2022-12-04', NULL),
(5, 28, '2022-12-05', NULL),
(6, 6, '2022-12-06', NULL),
(7, 29, '2022-12-07', NULL),
(8, 30, '2022-12-08', NULL),
(9, 31, '2022-12-09', NULL),
(10, 32, '2022-12-10', NULL),
(11, 33, '2022-12-11', NULL),
(12, 34, '2022-12-12', NULL),
(13, 41, '2008-01-01', NULL);

INSERT INTO Vaccines (EmployeeID, FacilityID, Type, DoseNumber, Date) VALUES
(1, 1, 'Pfizer', 1, '2022-12-01'),
(1, 1, 'Pfizer', 2, '2023-01-15'),
(2, 2, 'Moderna', 1, '2022-11-01'),
(2, 2, 'Moderna', 2, '2023-02-01'),
(3, 3, 'AstraZeneca', 1, '2022-10-01'),
(3, 3, 'AstraZeneca', 2, '2023-01-01'),
(4, 4, 'Johnson & Johnson', 1, '2022-09-01'),
(4, 4, 'Johnson & Johnson', 2, '2023-01-20'),
(5, 5, 'Pfizer', 1, '2022-08-01'),
(5, 5, 'Pfizer', 2, '2023-02-10'),
(6, 6, 'Moderna', 1, '2022-07-01'),
(6, 6, 'Moderna', 2, '2023-01-15'),
(7, 7, 'AstraZeneca', 1, '2022-06-01'),
(7, 7, 'AstraZeneca', 2, '2023-02-05'),
(8, 8, 'Johnson & Johnson', 1, '2022-05-01'),
(8, 8, 'Johnson & Johnson', 2, '2023-01-25'),
(9, 9, 'Pfizer', 1, '2022-04-01'),
(9, 9, 'Pfizer', 2, '2023-02-15'),
(10, 10, 'Moderna', 1, '2022-03-01'),
(10, 10, 'Moderna', 2, '2023-01-30'),
(11, 1, 'Pfizer', 1, '2022-12-01'),
(11, 1, 'Pfizer', 2, '2023-01-15'),
(12, 2, 'Moderna', 1, '2022-11-01'),
(12, 2, 'Moderna', 2, '2023-02-01'),
(13, 3, 'AstraZeneca', 1, '2022-10-01'),
(13, 3, 'AstraZeneca', 2, '2023-01-01'),
(14, 4, 'Johnson & Johnson', 1, '2022-09-01'),
(14, 4, 'Johnson & Johnson', 2, '2023-01-20'),
(15, 5, 'Pfizer', 1, '2022-08-01'),
(15, 5, 'Pfizer', 2, '2023-02-10'),
(16, 6, 'Moderna', 1, '2022-07-01'),
(16, 6, 'Moderna', 2, '2023-01-15'),
(17, 7, 'AstraZeneca', 1, '2022-06-01'),
(17, 7, 'AstraZeneca', 2, '2023-02-05'),
(18, 8, 'Johnson & Johnson', 1, '2022-05-01'),
(18, 8, 'Johnson & Johnson', 2, '2023-01-25'),
(19, 9, 'Pfizer', 1, '2022-04-01'),
(19, 9, 'Pfizer', 2, '2023-02-15'),
(20, 10, 'Moderna', 1, '2022-03-01'),
(20, 10, 'Moderna', 2, '2023-01-30'),
(21, 1, 'Pfizer', 1, '2022-12-01'),
(21, 1, 'Pfizer', 2, '2023-01-15'),
(22, 2, 'Moderna', 1, '2022-11-01'),
(22, 2, 'Moderna', 2, '2023-02-01'),
(23, 3, 'AstraZeneca', 1, '2022-10-01'),
(23, 3, 'AstraZeneca', 2, '2023-01-01'),
(24, 4, 'Johnson & Johnson', 1, '2022-09-01'),
(24, 4, 'Johnson & Johnson', 2, '2023-01-20'),
(25, 5, 'Pfizer', 1, '2022-08-01'),
(25, 5, 'Pfizer', 2, '2023-02-10'),
(26, 6, 'Moderna', 1, '2022-07-01'),
(26, 6, 'Moderna', 2, '2023-01-15'),
(27, 7, 'AstraZeneca', 1, '2022-06-01'),
(27, 7, 'AstraZeneca', 2, '2023-02-05'),
(28, 8, 'Johnson & Johnson', 1, '2022-05-01'),
(28, 8, 'Johnson & Johnson', 2, '2023-01-25'),
(29, 9, 'Pfizer', 1, '2022-04-01'),
(29, 9, 'Pfizer', 2, '2023-02-15'),
(30, 10, 'Moderna', 1, '2022-03-01'),
(30, 10, 'Moderna', 2, '2023-01-30'),
(31, 1, 'Pfizer', 1, '2022-12-01'),
(31, 1, 'Pfizer', 2, '2023-01-15'),
(32, 2, 'Moderna', 1, '2022-11-01'),
(32, 2, 'Moderna', 2, '2023-02-01'),
(33, 3, 'AstraZeneca', 1, '2022-10-01'),
(33, 3, 'AstraZeneca', 2, '2023-01-01'),
(34, 4, 'Johnson & Johnson', 1, '2022-09-01'),
(34, 4, 'Johnson & Johnson', 2, '2023-01-20'),
(35, 5, 'Pfizer', 1, '2022-08-01'),
(35, 5, 'Pfizer', 2, '2023-02-10'),
(36, 2, 'Moderna', 1, '2022-11-01'),
(36, 2, 'Moderna', 2, '2023-02-01'),
(37, 3, 'AstraZeneca', 1, '2022-10-01'),
(37, 3, 'AstraZeneca', 2, '2023-01-01'),
(38, 4, 'Johnson & Johnson', 1, '2022-09-01'),
(38, 4, 'Johnson & Johnson', 2, '2023-01-20'),
(39, 5, 'Pfizer', 1, '2022-08-01'),
(39, 5, 'Pfizer', 2, '2023-02-10');

INSERT INTO Infections(EmployeeID, Type, Date) VALUES
(1, 'COVID-19', '2022-12-01'),
(2, 'COVID-19', '2023-03-31'),
(3, 'COVID-19', '2023-01-05'),
(4, 'COVID-19', '2023-01-10'),
(5, 'COVID-19', '2023-01-15'),
(6, 'COVID-19', '2022-12-20'),
(7, 'COVID-19', '2022-12-25'),
(8, 'COVID-19', '2023-01-01'),
(9, 'COVID-19', '2023-01-05'),
(10, 'COVID-19', '2023-03-31'),
(11, 'SARS-Cov-2 Variant', '2023-01-15'),
(12, 'SARS-Cov-2 Variant', '2022-12-20'),
(13, 'SARS-Cov-2 Variant', '2022-12-25'),
(14, 'SARS-Cov-2 Variant', '2023-01-01'),
(15, 'SARS-Cov-2 Variant', '2023-01-05'),
(1, 'Flu', '2023-01-10'),
(2, 'Flu', '2023-01-15'),
(3, 'Flu', '2022-12-20'),
(4, 'Flu', '2022-12-25'),
(5, 'Flu', '2023-01-01'),
(21, 'COVID-19', '2023-03-31'),
(6, "COVID-19", "2022-09-05"),
(6, "COVID-19", "2023-03-31"),
(2, "Flu", "2022-08-05"),
(2, "SARS-Cov-2 Variant", "2022-08-05"),
(23, "COVID-19", "2022-12-01"),
(19, "COVID-19", "2023-03-31"),
(1, 'COVID-19', '2022-12-20'),
(1, 'COVID-19', '2023-02-01'),
(9, 'COVID-19', '2023-01-25'),
(9, 'COVID-19', '2023-02-15'),
(2, 'COVID-19', '2022-10-20'),
(2, 'COVID-19', '2022-11-20'),
(23, "COVID-19", "2023-01-03"),
(23, "COVID-19", "2023-02-06"),
(10, 'COVID-19', '2022-12-28'),
(10, 'COVID-19', '2023-02-01'),
(36, 'COVID-19', '2022-01-25'),
(36, 'COVID-19', '2022-04-15'),
(36, 'COVID-19', '2022-10-20'),
(37, 'COVID-19', '2022-01-20'),
(37, "COVID-19", "2022-05-03"),
(37, "COVID-19", "2022-11-01"),
(38, 'COVID-19', '2022-01-28'),
(38, 'COVID-19', '2022-03-01'),
(38, 'COVID-19', '2022-08-11'),
(39, 'COVID-19', '2022-03-26'),
(39, 'COVID-19', '2022-06-18'),
(39, 'COVID-19', '2022-09-22'),
(10, 'COVID-19', '2001-02-01');

INSERT INTO Schedule (FacilityID, EmployeeID, Date, StartTime, EndTime) VALUES
(1, 1, '2023-03-06', '08:00', '12:00'),
(2, 1, '2023-03-07', '08:00', '12:00'),
(3, 1, '2023-03-08', '08:00', '12:00'),
(4, 1, '2023-03-09', '08:00', '12:00'),
(1, 1, '2023-03-13', '08:00', '12:00'),
(2, 1, '2023-03-14', '08:00', '12:00'),
(3, 1, '2023-03-15', '08:00', '12:00'),
(4, 1, '2023-03-16', '08:00', '12:00'),
(1, 1, '2023-03-20', '08:00', '12:00'),
(2, 1, '2023-03-21', '08:00', '12:00'),
(3, 1, '2023-03-22', '08:00', '12:00'),
(4, 1, '2023-03-23', '08:00', '12:00'),
(2, 2, '2023-03-06', '12:00', '16:00'),
(2, 2, '2023-03-07', '08:00', '12:00'),
(4, 2, '2023-03-08', '12:00', '16:00'),
(5, 2, '2023-03-09', '12:00', '16:00'),
(2, 2, '2023-03-13', '12:00', '16:00'),
(3, 2, '2023-03-14', '12:00', '16:00'),
(4, 2, '2023-03-15', '12:00', '16:00'),
(5, 2, '2023-03-16', '12:00', '16:00'),
(2, 2, '2023-03-20', '12:00', '16:00'),
(3, 2, '2023-03-21', '12:00', '16:00'),
(4, 2, '2023-03-22', '12:00', '16:00'),
(5, 2, '2023-03-23', '12:00', '16:00'),
(2, 3, '2023-03-06', '16:00', '20:00'),
(3, 3, '2023-03-07', '16:00', '20:00'),
(5, 3, '2023-03-08', '16:00', '20:00'),
(6, 3, '2023-03-09', '16:00', '20:00'),
(2, 3, '2023-03-13', '16:00', '20:00'),
(3, 3, '2023-03-14', '16:00', '20:00'),
(5, 3, '2023-03-15', '16:00', '20:00'),
(6, 3, '2023-03-16', '16:00', '20:00'),
(2, 3, '2023-03-20', '16:00', '20:00'),
(3, 3, '2023-03-21', '16:00', '20:00'),
(5, 3, '2023-03-22', '16:00', '20:00'),
(6, 3, '2023-03-23', '16:00', '20:00'),
(4, 4, '2023-03-06', '20:00', '23:59'),
(6, 4, '2023-03-07', '20:00', '23:59'),
(7, 4, '2023-03-08', '20:00', '23:59'),
(8, 4, '2023-03-09', '20:00', '23:59'),
(4, 4, '2023-03-13', '20:00', '23:59'),
(6, 4, '2023-03-14', '20:00', '23:59'),
(7, 4, '2023-03-15', '20:00', '23:59'),
(8, 4, '2023-03-16', '20:00', '23:59'),
(4, 4, '2023-03-20', '20:00', '23:59'),
(6, 4, '2023-03-21', '20:00', '23:59'),
(7, 4, '2023-03-22', '20:00', '23:59'),
(8, 4, '2023-03-23', '20:00', '23:59'),
(5, 5, '2023-03-06', '08:00', '12:00'),
(6, 5, '2023-03-07', '08:00', '12:00'),
(7, 5, '2023-03-08', '08:00', '12:00'),
(8, 5, '2023-03-09', '08:00', '12:00'),
(5, 5, '2023-03-13', '08:00', '12:00'),
(6, 5, '2023-03-14', '08:00', '12:00'),
(7, 5, '2023-03-15', '08:00', '12:00'),
(8, 5, '2023-03-16', '08:00', '12:00'),
(5, 5, '2023-03-20', '08:00', '12:00'),
(6, 5, '2023-03-21', '08:00', '12:00'),
(7, 5, '2023-03-22', '08:00', '12:00'),
(8, 5, '2023-03-23', '08:00', '12:00'),
(6, 6, '2023-03-06', '12:00', '16:00'),
(9, 6, '2023-03-07', '12:00', '16:00'),
(10, 6, '2023-03-08', '12:00', '16:00'),
(11, 6, '2023-03-09', '12:00', '16:00'),
(6, 6, '2023-03-13', '12:00', '16:00'),
(9, 6, '2023-03-14', '12:00', '16:00'),
(10, 6, '2023-03-15', '12:00', '16:00'),
(11, 6, '2023-03-16', '12:00', '16:00'),
(6, 6, '2023-03-20', '12:00', '16:00'),
(9, 6, '2023-03-21', '12:00', '16:00'),
(10, 6, '2023-03-22', '12:00', '16:00'),
(11, 6, '2023-03-23', '12:00', '16:00'),
(7, 7, '2023-03-06', '16:00', '20:00'),
(9, 7, '2023-03-07', '16:00', '20:00'),
(10, 7, '2023-03-08', '16:00', '20:00'),
(11, 7, '2023-03-09', '16:00', '20:00'),
(7, 7, '2023-03-13', '16:00', '20:00'),
(9, 7, '2023-03-14', '16:00', '20:00'),
(10, 7, '2023-03-15', '16:00', '20:00'),
(11, 7, '2023-03-16', '16:00', '20:00'),
(7, 7, '2023-03-20', '16:00', '20:00'),
(9, 7, '2023-03-21', '16:00', '20:00'),
(10, 7, '2023-03-22', '16:00', '20:00'),
(11, 7, '2023-03-23', '16:00', '20:00'),
(8, 8, '2023-03-06', '20:00', '23:59'),
(9, 8, '2023-03-07', '20:00', '23:59'),
(10, 8, '2023-03-08', '20:00', '23:59'),
(11, 8, '2023-03-09', '20:00', '23:59'),
(8, 8, '2023-03-13', '20:00', '23:59'),
(9, 8, '2023-03-14', '20:00', '23:59'),
(10, 8, '2023-03-15', '20:00', '23:59'),
(11, 8, '2023-03-16', '20:00', '23:59'),
(8, 8, '2023-03-20', '20:00', '23:59'),
(9, 8, '2023-03-21', '20:00', '23:59'),
(10, 8, '2023-03-22', '20:00', '23:59'),
(11, 8, '2023-03-23', '20:00', '23:59'),
(9, 9, '2023-03-06', '20:00', '23:59'),
(2, 9, '2023-03-07', '08:00', '12:00'),
(12, 9, '2023-03-08', '20:00', '23:59'),
(12, 9, '2023-03-09', '20:00', '23:59'),
(9, 9, '2023-03-13', '20:00', '23:59'),
(9, 9, '2023-03-14', '20:00', '23:59'),
(12, 9, '2023-03-15', '20:00', '23:59'),
(12, 9, '2023-03-16', '20:00', '23:59'),
(9, 9, '2023-03-20', '20:00', '23:59'),
(9, 9, '2023-03-21', '20:00', '23:59'),
(12, 9, '2023-03-22', '20:00', '23:59'),
(12, 9, '2023-03-23', '20:00', '23:59'),
(10, 10, '2023-03-06', '12:00', '23:59'),
(10, 10, '2023-03-07', '12:00', '23:59'),
(12, 10, '2023-03-08', '12:00', '23:59'),
(12, 10, '2023-03-09', '12:00', '23:59'),
(10, 10, '2023-03-13', '12:00', '23:59'),
(10, 10, '2023-03-14', '12:00', '23:59'),
(12, 10, '2023-03-15', '12:00', '23:59'),
(12, 10, '2023-03-16', '12:00', '23:59'),
(10, 10, '2023-03-20', '12:00', '23:59'),
(10, 10, '2023-03-21', '12:00', '23:59'),
(12, 10, '2023-03-22', '12:00', '23:59'),
(12, 10, '2023-03-23', '12:00', '23:59'),
(10, 10, '2023-03-27', '12:00', '23:59'),
(10, 10, '2023-03-28', '12:00', '23:59'),
(12, 10, '2023-03-29', '12:00', '23:59'),
(12, 10, '2023-03-30', '12:00', '23:59'),
(1, 11, '2023-03-06', '8:00', '12:00'),
(12, 11, '2023-03-07', '8:00', '12:00'),
(1, 11, '2023-03-13', '8:00', '12:00'),
(12, 11, '2023-03-14', '8:00', '12:00'),
(1, 11, '2023-03-20', '8:00', '12:00'),
(12, 11, '2023-03-21', '8:00', '12:00'),
(2, 12, '2023-03-04', '8:00', '16:00'),
(2, 12, '2023-03-05', '8:00', '16:00'),
(2, 12, '2023-03-11', '8:00', '16:00'),
(2, 12, '2023-03-12', '8:00', '16:00'),
(2, 12, '2023-03-18', '8:00', '16:00'),
(2, 12, '2023-03-19', '8:00', '16:00'),
(3, 13, '2023-03-07', '8:00', '18:00'),
(3, 13, '2023-03-14', '8:00', '18:00'),
(3, 13, '2023-03-21', '8:00', '18:00'),
(1, 14, '2023-03-12', '8:00', '20:00'),
(1, 14, '2023-03-18', '8:00', '20:00'),
(4, 14, '2023-03-19', '14:00', '16:00'),
(5, 15, '2023-03-07', '8:00', '18:00'),
(5, 15, '2023-03-14', '8:00', '18:00'),
(5, 15, '2023-03-21', '8:00', '18:00'),
(6, 16, '2023-03-12', '8:00', '20:00'),
(6, 16, '2023-03-18', '8:00', '20:00'),
(6, 16, '2023-03-19', '14:00', '16:00'),
(2, 17, '2023-03-07', '8:00', '12:00'),
(7, 17, '2023-03-14', '8:00', '18:00'),
(7, 17, '2023-03-21', '8:00', '18:00'),
(8, 18, '2023-03-07', '8:00', '18:00'),
(8, 18, '2023-03-14', '8:00', '18:00'),
(8, 18, '2023-03-21', '8:00', '18:00'),
(10, 19, '2023-03-07', '8:00', '18:00'),
(10, 19, '2023-03-14', '8:00', '18:00'),
(10, 19, '2023-03-21', '8:00', '18:00'),
(10, 19, '2023-03-28', '8:00', '18:00'),
(1, 21, '2023-03-07', '8:00', '18:00'),
(1, 21, '2023-03-14', '8:00', '18:00'),
(1, 21, '2023-03-21', '8:00', '18:00'),
(1, 21, '2023-03-28', '8:00', '18:00'),
(1, 22, '2023-03-12', '8:00', '20:00'),
(1, 22, '2023-03-18', '8:00', '20:00'),
(1, 22, '2023-03-19', '14:00', '16:00'),
(11, 23, '2023-03-07', '8:00', '18:00'),
(11, 23, '2023-03-14', '8:00', '18:00'),
(11, 23, '2023-03-21', '8:00', '18:00'),
(11, 23, '2023-03-28', '8:00', '18:00'),
(12, 24, '2023-03-07', '8:00', '18:00'),
(12, 24, '2023-03-14', '8:00', '18:00'),
(12, 24, '2023-03-21', '8:00', '18:00'),
(12, 24, '2023-03-28', '8:00', '18:00'),
(2, 25, '2023-03-08', '16:00', '18:00'),
(2, 25, '2023-03-15', '16:00', '18:00'),
(2, 25, '2023-03-22', '16:00', '18:00'),
(2, 25, '2023-03-29', '16:00', '18:00'),
(3, 26, '2023-03-08', '16:00', '18:00'),
(3, 26, '2023-03-15', '16:00', '18:00'),
(3, 26, '2023-03-22', '16:00', '18:00'),
(3, 26, '2023-03-29', '16:00', '18:00'),
(4, 27, '2023-03-08', '16:00', '18:00'),
(4, 27, '2023-03-15', '16:00', '18:00'),
(4, 27, '2023-03-22', '16:00', '18:00'),
(4, 27, '2023-03-29', '16:00', '18:00'),
(5, 28, '2023-03-08', '16:00', '18:00'),
(5, 28, '2023-03-15', '16:00', '18:00'),
(5, 28, '2023-03-22', '16:00', '18:00'),
(5, 28, '2023-03-29', '16:00', '18:00'),
(7, 29, '2023-03-08', '16:00', '18:00'),
(7, 29, '2023-03-15', '16:00', '18:00'),
(7, 29, '2023-03-22', '16:00', '18:00'),
(7, 29, '2023-03-29', '16:00', '18:00'),
(8, 30, '2023-03-08', '16:00', '18:00'),
(8, 30, '2023-03-15', '16:00', '18:00'),
(8, 30, '2023-03-22', '16:00', '18:00'),
(8, 30, '2023-03-29', '16:00', '18:00'),
(9, 31, '2023-03-08', '16:00', '18:00'),
(9, 31, '2023-03-15', '16:00', '18:00'),
(9, 31, '2023-03-22', '16:00', '18:00'),
(9, 31, '2023-03-29', '16:00', '18:00'),
(10, 32, '2023-03-08', '16:00', '18:00'),
(10, 32, '2023-03-15', '16:00', '18:00'),
(10, 32, '2023-03-22', '16:00', '18:00'),
(10, 32, '2023-03-29', '16:00', '18:00'),
(11, 33, '2023-03-08', '16:00', '18:00'),
(11, 33, '2023-03-15', '16:00', '18:00'),
(11, 33, '2023-03-22', '16:00', '18:00'),
(11, 33, '2023-03-29', '16:00', '18:00'),
(12, 34, '2023-03-08', '16:00', '18:00'),
(12, 34, '2023-03-15', '16:00', '18:00'),
(12, 34, '2023-03-22', '16:00', '18:00'),
(12, 34, '2023-03-29', '16:00', '18:00'),
(6, 35, '2023-03-06', '00:00', '8:00'),
(6, 35, '2023-03-13', '00:00', '8:00'),
(6, 35, '2023-03-20', '00:00', '8:00'),
(6, 35, '2023-03-27', '00:00', '8:00'),
(13, 36, '2023-03-20', '08:00', '12:00'),
(13, 36, '2023-03-21', '08:00', '12:00'),
(13, 36, '2023-03-22', '08:00', '12:00'),
(13, 36, '2023-03-23', '08:00', '12:00'),
(13, 36, '2023-03-27', '08:00', '12:00'),
(13, 36, '2023-03-28', '08:00', '12:00'),
(13, 36, '2023-03-29', '08:00', '12:00'),
(13, 36, '2023-03-30', '08:00', '12:00'),
(13, 36, '2023-03-03', '08:00', '12:00'),
(13, 36, '2023-03-04', '08:00', '12:00'),
(13, 36, '2023-03-05', '08:00', '12:00'),
(13, 36, '2023-03-06', '08:00', '12:00'),
(13, 37, '2023-03-20', '08:00', '12:00'),
(13, 37, '2023-03-21', '08:00', '12:00'),
(13, 37, '2023-03-22', '08:00', '12:00'),
(13, 37, '2023-03-23', '08:00', '12:00'),
(13, 37, '2023-03-27', '08:00', '12:00'),
(13, 37, '2023-03-28', '08:00', '12:00'),
(13, 37, '2023-03-29', '08:00', '12:00'),
(13, 37, '2023-03-30', '08:00', '12:00'),
(13, 37, '2023-03-03', '08:00', '12:00'),
(13, 37, '2023-03-04', '08:00', '12:00'),
(13, 37, '2023-03-05', '08:00', '12:00'),
(13, 37, '2023-03-06', '08:00', '12:00'),
(13, 38, '2023-03-20', '08:00', '12:00'),
(13, 38, '2023-03-21', '08:00', '12:00'),
(13, 38, '2023-03-22', '08:00', '12:00'),
(13, 38, '2023-03-23', '08:00', '12:00'),
(13, 38, '2023-03-27', '08:00', '12:00'),
(13, 38, '2023-03-28', '08:00', '12:00'),
(13, 38, '2023-03-29', '08:00', '12:00'),
(13, 38, '2023-03-30', '08:00', '12:00'),
(13, 38, '2023-03-03', '08:00', '12:00'),
(13, 38, '2023-03-04', '08:00', '12:00'),
(13, 38, '2023-03-05', '08:00', '12:00'),
(13, 38, '2023-03-06', '08:00', '12:00'),
(13, 39, '2023-03-20', '08:00', '12:00'),
(13, 39, '2023-03-21', '08:00', '12:00'),
(13, 39, '2023-03-22', '08:00', '12:00'),
(13, 39, '2023-03-23', '08:00', '12:00'),
(13, 39, '2023-03-27', '08:00', '12:00'),
(13, 39, '2023-03-28', '08:00', '12:00'),
(13, 39, '2023-03-29', '08:00', '12:00'),
(13, 39, '2023-03-30', '08:00', '12:00'),
(13, 39, '2023-03-03', '08:00', '12:00'),
(13, 39, '2023-03-04', '08:00', '12:00'),
(13, 39, '2023-03-05', '08:00', '12:00'),
(13, 39, '2023-03-06', '08:00', '12:00'),
(13, 20, '2023-03-20', '08:00', '12:00'),
(13, 20, '2023-03-21', '08:00', '12:00'),
(13, 20, '2023-03-22', '08:00', '12:00'),
(13, 20, '2023-03-23', '08:00', '12:00'),
(13, 20, '2023-03-27', '08:00', '12:00'),
(13, 20, '2023-03-28', '08:00', '12:00'),
(13, 20, '2023-03-29', '08:00', '12:00'),
(13, 20, '2023-03-30', '08:00', '12:00'),
(13, 20, '2023-03-03', '08:00', '12:00'),
(13, 20, '2023-03-04', '08:00', '12:00'),
(13, 20, '2023-03-05', '08:00', '12:00'),
(13, 20, '2023-03-06', '08:00', '12:00'),
(13, 36, '2023-04-12', '08:00', '12:00'),
(13, 36, '2023-04-13', '08:00', '12:00'),
(13, 36, '2023-04-14', '08:00', '12:00'),
(13, 37, '2023-04-12', '08:00', '12:00'),
(13, 37, '2023-04-13', '08:00', '12:00'),
(13, 37, '2023-04-14', '08:00', '12:00'),
(13, 38, '2023-04-12', '08:00', '12:00'),
(13, 38, '2023-04-13', '08:00', '12:00'),
(13, 38, '2023-04-14', '08:00', '12:00'),
(13, 39, '2023-04-12', '08:00', '12:00'),
(13, 39, '2023-04-13', '08:00', '12:00'),
(13, 39, '2023-04-14', '08:00', '12:00'),
(13, 20, '2023-04-12', '08:00', '12:00'),
(13, 20, '2023-04-13', '08:00', '12:00'),
(13, 20, '2023-04-14', '08:00', '12:00'),
(7, 17, '2023-04-14', '08:00', '12:00');

INSERT INTO EmailLog (FacilityID, EmployeeID, Date, Subject, Body) VALUES
(13, 36, '2023-04-09', 'Downtown Hospital Schedule', 
'Dear Maelle Campagnie, Here is your schedule'),
(13, 37, '2023-04-09', 'Downtown Hospital Schedule', 
'Dear Clemence Fouquet, Here is your schedule'),
(13, 38, '2023-04-09', 'Downtown Hospital Schedule', 
'Dear Nadira Rafai, Here is your schedule'),
(13, 39, '2023-04-09', 'Downtown Hospital Schedule', 
'Dear Anais Perez, Here is your schedule'),
(13, 20, '2023-04-09', 'Downtown Hospital Schedule', 
'Dear Emily Thomas, Here is your schedule');

