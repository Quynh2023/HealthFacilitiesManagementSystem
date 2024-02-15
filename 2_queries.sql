//Query1: List of facilities with the corresponding number of current employees

SELECT f.Name AS FacilityName, f.Address, p.City, p.Province, p.PostalCode, f.PhoneNumber, f.WebAddress, f.Type, f.Capacity, CONCAT(e.FName, " ", e.LName) AS GeneralManager, COUNT(em.EmployeeID) AS NumberOfCurrentEmployees
FROM Facilities f, PostalCodes p, Managers mgrs, Employment em, Employees e
WHERE f.PostalCodeID = p.PostalCodeID AND
      f.FacilityID = mgrs.FacilityID AND
      mgrs.EmployeeID = e.EmployeeID AND
      f.FacilityID = em.FacilityID AND
      em.EndDate IS NULL
      GROUP BY f.FacilityID
      ORDER BY p.province, p.city, f.Type, NumberOfCurrentEmployees


//Query2: List of doctors and nurses infected 3 or more times by COVID-19
SELECT FName, LName, FirstDayOfWork, Role, DoBirth, Email, TotalHours
FROM (
	 SELECT e.EmployeeID, e.FName, e.LName, MIN(em2.StartDate) AS FirstDayOfWork, e.Role, e.DoBirth, e.Email
        	FROM Employees e, Employment em1, Employment em2, Infections i
        	WHERE e.EmployeeID = i.EmployeeID AND
  	  	   e.EmployeeID = em1.EmployeeID AND
  	  	   e.EmployeeID = em2.EmployeeID AND
  	  	   e.Role IN ('Nurse', 'Doctor') AND
 	   	     em1.EndDate IS NULL AND
  	  	   e.EmployeeID IN (
                    		SELECT EmployeeID
                    		FROM Infections
                    		WHERE Type = 'COVID-19'
                    		GROUP BY EmployeeID
                    		HAVING COUNT(InfectionID) >=3)
        	GROUP BY e.EmployeeID
        	ORDER BY e.Role, e.FName, e.LName
) AS T1,
(
	SELECT EmployeeID, SUM(TIMESTAMPDIFF(HOUR, StartTime, EndTime)) AS TotalHours
	FROM Schedule
	GROUP BY EmployeeID
) AS T2
WHERE T1.EmployeeID = T2.EmployeeID;


//Query3: List of nurses with most working hours
SELECT FName, LName, FirstDayOfWork, Role, DoBirth, Email, TotalHours
FROM (
	SELECT e.EmployeeID, e.FName, e.LName, MIN(em2.StartDate) AS
				FirstDayOfWork, e.Role, e.DoBirth, e.Email
	FROM Employees e, Employment em1, Employment em2
	WHERE e.EmployeeID = em1.EmployeeID AND
				e.EmployeeID = em2.EmployeeID AND
				e.Role = 'Nurse' AND
				em1.EndDate IS NULL
	GROUP BY e.EmployeeID
	ORDER BY e.Role, e.FName, e.LName
) AS T1,
(
	SELECT EmployeeID, SUM(TIMESTAMPDIFF(HOUR, StartTime, EndTime)) AS TotalHours
	FROM Schedule
	GROUP BY EmployeeID
) AS T2
WHERE T1.EmployeeID = T2.EmployeeID AND
			T2.TotalHours = (
				SELECT MAX(TotalHours)
				FROM (
					SELECT SUM(TIMESTAMPDIFF(HOUR, StartTime, EndTime)) AS TotalHours
					FROM Schedule
					WHERE EmployeeID IN (
						SELECT e.EmployeeID
						FROM Employees e, Employment em1
						WHERE e.EmployeeID = em1.EmployeeID AND
						e.Role = 'Nurse' AND
						em1.EndDate IS NULL)
					GROUP BY EmployeeID
) AS T3
);






