
/* lecture structure (lectureName<String>, LectureObject{name, id, greedingsType})*/
const lectures = new Map();


/* (lectureID<number>, Map(studentID, StudentOfLectureObject(studentId, name, surname, midterm, final, letter)))*/
const studentsOfLecture = new Map();

/* (studentId, StudentObject(id, lectures, name, surname, gpa))*/
const students = new Map();

let GradingTypes = {
    type1: 1,
    type2: 2
}

let incrementIdForLecture = 1;

studentsOfLecture.set(1, new Map());


function getLetterGrade(gradeType, midterm, final)
{

    let totalGrade = (midterm * 0.4) + (final * 0.6);

    if(gradeType === GradingTypes.type1)
    {   
        if(totalGrade >= 90){
            return "A";
        }else if(totalGrade >= 80)
        {
            return "B";
        }else if(totalGrade >= 70)
        {
            return "C";
        }else if(totalGrade >= 60)
        {
            return "D";
        }else
        {
            return "F";
        }
    }else if(gradeType === GradingTypes.type2)
    {   
        if(totalGrade >= 93){
            return "A";
        }else if(totalGrade >= 85)
        {
            return "B";
        }else if(totalGrade >= 77)
        {
            return "C";
        }else if(totalGrade >= 70)
        {
            return "D";
        }else
        {
            return "F";
        }
    }
    return "error";
}

function getTotalScore(midterm, final)
{
    return (midterm * 0.4) + (final * 0.6);
}


class Lecture{
    lectureName;
    lectureId;
    gradingType;

    constructor(lectureName, lectureId, gradingType)
    {
        this.lectureName = lectureName;
        this.lectureId = lectureId;
        this.gradingType = gradingType;
    }
}

class StudentOfLecture{
    studentId;
    name;
    surname;
    midterm;
    final;
    letterNote;
    constructor(studentId, name, surname, midterm, final, letter)
    {
        this.studentId = studentId;
        this.name = name;
        this.surname = surname;
        this.midterm = midterm;
        this.final = final;
        this.letterNote = letter;
    }
}

class Student{
    id;
    lectures;
    name;
    surname;
    gpa;

    constructor(id, lectures, name, surname, gpa)
    {
        this.id = id;
        this.lectures = lectures;
        this.name = name;
        this.surname = surname;
        this.gpa = gpa;
    }
}

function getAutoIdForLecture()
{
    incrementIdForLecture+=1
    return incrementIdForLecture -1;
}

function getIdForLecture(lectureName)
{
    return lectures.get(lectureName).lectureId;
}


function addCourse(courseName, gradeType)
{
    lectures.set(courseName, new Lecture(courseName, getAutoIdForLecture(), gradeType));
    studentsOfLecture.set(getIdForLecture(courseName), new Map());
}

let testLecture = new Lecture("test", 2, GradingTypes.type1);
console.log(testLecture.lectureName);
console.log(testLecture.lectureId);
3
addCourse("testLecture", GradingTypes.type1);
lectures.forEach((lecture, courseId, lectures) => {
    console.log(lecture.lectureName);
});



//testAddCourse();

function addStudentToCourse(courseName, studentId, name, surname, midterm, final)
{
    if(lectures.has(courseName))
    {
        let course = lectures.get(courseName);
        let newStudent = new StudentOfLecture(studentId, name, surname, midterm, final, getLetterGrade(course.gradingType, midterm, 
            final));  
        studentsOfLecture.get(course.lectureId).set(studentId, newStudent);
        console.log(newStudent.letterNote);
        console.log("FF");
        addCourseToStudent(course.lectureId, studentId, name, surname, newStudent.letterNote);
    }
}

//returns boolean
function isStudentExist(courseId, studentId){
    return studentsOfLecture.get(courseId).has(studentId);
}


function addCourseToStudent(courseId, studentId, name, surname, letterNote)
{
    if(!students.has(studentId))
    {
        students.set(studentId, new Student(studentId, [], name, surname, 0));
    }
    students.get(studentId).lectures.push(courseId);
    addLetterNoteToGpa(studentId, letterNote);
}
function addLetterNoteToGpa(studentId, letterNote)
{
    let student = students.get(studentId);
    let factorOfLetterGrade = 0;
    switch(letterNote)
    {
        case "A":
            factorOfLetterGrade = 4;
            break;
        case 'B':
            factorOfLetterGrade = 3;
            break;  
        case "C":
            factorOfLetterGrade = 2;
            break;
        case "D":
            factorOfLetterGrade = 1;
            break;
        default:
            factorOfLetterGrade = 0;
            break;
    }
    student.gpa = ((student.gpa * (student.lectures.length-1)) + (factorOfLetterGrade)) / (student.lectures.length); 
}
/* ReturnType : [[studentId, name, surname, midterm, final, totalScore, grade]] */
function getStudentsForLecture(courseName)
{
    if(lectures.has(courseName))
    {
        let returnArray = []
        let course = lectures.get(courseName);
        let studentsMap = studentsOfLecture.get(course.lectureId);
        studentsMap.array.forEach((studentId, studentOfLecture) => {
            returnArray.push([studentOfLecture.id, studentOfLecture.name , studentOfLecture.surname,
                studentOfLecture.midterm, studentOfLecture.final, 
            getTotalScore(studentOfLecture.midterm, studentOfLecture.final), studentOfLecture.letterNote]);
        });
        return returnArray;
    }
    return null;
}

/* updates the StudentOfLecture object for given course name 
 * updates student object if any attirbutes are different.
*/
function updateStudentOfLecture(courseName, studentId, name, surname, midterm, final)
{
    let course = lectures.get(courseName);
    let studentsMap = studentsOfLecture.get(course.lectureId);
    let studentofLecture = studentsMap.get(studentId);
    let oldLetterNote = studentofLecture.letterNote;
    studentofLecture.name = name;
    studentofLecture.surname = surname;
    studentofLecture.midterm = midterm;
    studentofLecture.final = final;
    studentofLecture.letterNote = getLetterGrade(lectures.get(courseName).gradingType, midterm, final);

    updateStudent(studentId, name, surname, studentofLecture.letterNote, oldLetterNote);
}

/* Updates the attributes of Student Object for given student id */
function updateStudent(studentId, name, surname, newletterNote, oldLetterNote)
{
    let student = students.get(studentId);
    student.name = name;
    student.surname = surname;
    updateStudentGpa(studentId, newletterNote, oldLetterNote);
}

function updateStudentGpa(studenId, newLetterNote, oldLetterNote)
{
    let student = students.get(studenId);
    let letterFactorNewNote = getLetterFactor(newLetterNote);
    let letterFactorOldNote = getLetterFactor(oldLetterNote);

    student.gpa = (student.gpa * student.lectures.length - (oldLetterNote * letterFactorOldNote) + (newLetterNote * letterFactorNewNote)) / student.lectures.lenght;
}
function getLetterFactor(letterNote)
{
    switch(letterNote)
    {
        case "A":
            return 4;
            break;
        case "B":
            return 3;
            break;  
        case "C":
            return 2;
            break;
        case "D":
            return 1;
            break;
        default:
            return 0;
    }
}


/* Return Type: [[studentId, name, surname, totalScore,gpa]]
 * returns all students with given name and surname
*/
function searchStudent(studentName, studentSurname)
{
    let studentReturnArray = []
    students.forEach((student, studentId, students) => {
        if(student.name === studentName && student.surname === studentSurname)
        {
            studentReturnArray.push([student.id, student.name, student.surname, 
            student.lectures, student.gpa]);
        }
    });
    console.log("" + studentReturnArray[0][0]);
        console.log(studentReturnArray[0][1]);
        console.log(studentReturnArray[0][2]);
        console.log(studentReturnArray[0][3][0]);
        console.log(studentReturnArray[0][4]);
    return studentReturnArray;
}


/* Return Type: [[id, name, surname, midterm, final, letterGrade]]
 * Getter for all students in specific course
 */
function getAllStudents(courseId)
{
    let studentsArray = [];
    let studentsMapOfLecture = studentsOfLecture.get(courseId);
    studentsMapOfLecture.forEach((studentObject, studentId, studentsMapOfLecture) => 
    {
        studentsArray.push([studentObject.studentId, studentObject.name,
            studentObject.surname, studentObject.midterm, studentObject.final, 
        studentObject.letterNote]);
    });
    return studentsArray;
}

/* Return Type: [[student name,surname,midterm, final, totalscore, letterGrade]] 
 * getter function for passed students in specific lecture
*/
function getPassedStudents(courseId)
{
    let studentsReturnArray = [];
    let studentsMapOfLecture = studentsOfLecture.get(courseId);

    studentsMapOfLecture.forEach((studentObject, studentId, studentsMapOfLecture) => {
        if('F' !== studentObject.letterNote)
        {
            studentsReturnArray.push([studentObject.studentId, studentObject.name,
            studentObject.surname, studentObject.midterm, studentObject.final, 
        getTotalScore(studentObject.midterm, studentObject.final) ,studentObject.letterNote]);        }
    });
    return studentsReturnArray;
}

/* Return Type: [[student name,surname,midterm, final, totalscore, lettergrade]] 
 *  Getter function for failed students in specific lecture
*/
function getFailedStudents(courseId)
{
    let studentsReturnArray = [];
    let studentsMapOfLecture = studentsOfLecture.get(courseId);

    studentsMapOfLecture.forEach((studentObject, courseId, studentsMapOfLecture) => {
        if('F' === studentObject.letterNote)
        {
            studentsReturnArray.push([studentObject.studentId, studentObject.name, 
            studentObject.surname, studentObject.midterm, 
        studentObject.final, getTotalScore(studentObject.midterm, studentObject.final), 
    studentObject.letterNote]);
        }
    });
    
    return studentsReturnArray;
}

/* Return Type : [[numberOfPassedStudent, numberOfFailedStudent, meanScore]]
 * Getter function for detailed information in specific lecture
*/
function getDetailedStatistic(courseId)
{
    let detailedStatistic = [];

    let passedStudentNumber = getPassedStudents(courseId).length;
    let failedStudents = getFailedStudents(courseId).length;
    let meanScore = meanScoreOfLecture(courseId);

    return [passedStudentNumber, failedStudents, meanScore];
}

/* returns means Score of lecture */
function meanScoreOfLecture(courseId)
{
    let studentNumber = 0;
    let gradeSum = 0;
    
    let studentsMapOfLecture = studentsOfLecture.get(courseId);
    studentsMapOfLecture.forEach((studentObject, studentId, studentsMapOfLecture) => 
    {
        studentNumber +=1;
        gradeSum += getTotalScore(studentObject.midterm, studentObject.final);
    });
    return gradeSum/studentNumber;
}


function searchStudentHTML()
{

    let nameSurname = document.getElementById("searchStudent").value;
    let nameSurnameArray = nameSurname.split(" ");
    let surname;
    let name;
    //const searchSectionElement = document.getElementById("searchSection");
    //searchSectionElement.innerHTML = '';
    let tableHeader = document.createElement("thead");
    let tableBody = document.createElement("tbody");
    //table.appendChild(tableHeader);
    //table.appendChild(tableBody);
    document.getElementById("searchTable").innerHTML = '';
    document.getElementById("searchTable").appendChild(tableHeader);
    document.getElementById("searchTable").appendChild(tableBody);

    //let row = document.getElementById("searchSection");
    //row.innerHTML = "<tr><th>Student ID</th><th>Student Name</th><th>Student Surname</th><th>Lectures</th><th>Letter Grade</th></tr>";
    
    const headerRow = document.createElement('tr');
    const headerColumns = ['Student Id', 'name', 'surname', 'lecture number', 'GPA'];
    for(i=0; i< 5; i++)
    {
        const th = document.createElement('th');
        th.textContent = headerColumns[i];
        headerRow.appendChild(th);
    }
    tableHeader.appendChild(headerRow);
    
    
    if(nameSurnameArray.length > 1)
    {
        surname = nameSurnameArray[nameSurnameArray.length - 1];
        name = nameSurnameArray.slice(0,- 1).join(" ");
    }else{

        //todo empty list
    }
    let students = searchStudent(name, surname);
    console.log(students[0][0]);
    

    for(i=0; i<students.length; i++)
    {

        const newRow = document.createElement('tr');
        /*students[i].forEach(item => {
            const td = document.createElement('td');
            td.textContent = item;
            newRow.appendChild(td);
        });*/
        for(j = 0; j< students[i].length; j++)
        {   const td = document.createElement('td');
            if(j === 3)
            {
                const lectureButton = document.createElement('button');
                lectureButton.textContent = "See Lectures: " + students[i][3].length;
                lectureButton.value = students[i][0] + '';
                lectureButton.id = 'lectureButton';
                lectureButton.addEventListener('click', function(event){
                    lecturesOfStudentHTML(parseInt(lectureButton.value));
                });
                td.appendChild(lectureButton);
            }else{
                td.textContent = students[i][j];
            }
            newRow.appendChild(td);
        }
        tableBody.appendChild(newRow);
        //row.innerHTML += "<tr><td>"+ students[i][0]+ "</td><td>" +students[i][1] + "</td><td>"+ students[i][2]+"</td><td>"+ students[i][3]+"</td><td>" + students[i][4] + "</td></tr>";
    }
}

function lecturesOfStudentHTML(studentId)
{
    let table = document.getElementById('searchTable');
    table.innerHTML = "";

    let tableHeader = document.createElement('thead');
    let tableBody = document.createElement('tbody');

    table.appendChild(tableHeader);
    table.appendChild(tableBody);

    const headerColumns = ["Lecture Name", "Midterm", "Final", "Letter Grade"];
    const headerRow = document.createElement('tr');
    for(i=0; i< 5; i++)
    {
        const th = document.createElement('th');
        th.textContent = headerColumns[i];
        headerRow.appendChild(th);
    }
    tableHeader.appendChild(headerRow);


    let lecturesAndGrades = getLecturesNameAndGradesOfStudent(studentId);
    console.log(lecturesAndGrades);
    for(i=0; i < lecturesAndGrades.length; i++)
    {
        const row = document.createElement('tr');
        for(j=0; j< lecturesAndGrades[i].length; j++)
        {
            console.log(lecturesAndGrades[i][j]);
            const td = document.createElement('td');
            td.textContent = lecturesAndGrades[i][j] + '';
            row.appendChild(td);
        }
        tableBody.appendChild(row);
    }
}

/* return type [[lectureName, midterm, final, letterNote]]*/
function getLecturesNameAndGradesOfStudent(studentId)
{
    let lectureArray=[];
    let student = students.get(studentId);
    let lectures = student.lectures;

    lectures.forEach(lectureId => {
        lectureArray.push(getLectureNameAndLectureGrade(lectureId, studentId));
    });
    console.log(lectureArray);
    return lectureArray;
}

function getLectureNameFromId(lectureId)
{
    let lectureName = "";
    lectures.forEach((lecture, lectureName, lectures) => {
        if(lecture.lectureId === lectureId)
        {
            lectureNameResult = lectureName;
        }
    });
    return lectureNameResult;
}
function getLectureNameAndLectureGrade(lectureId, studentId)
{
    let allStudentsOfLecture = studentsOfLecture.get(lectureId);
    let student = allStudentsOfLecture.get(studentId);

    return [getLectureNameFromId(lectureId), student.midterm, student.final, student.letterNote];    
}

function addLectureHTML()
{
    let courseName = document.getElementById('courseName').value;
    let pointScale = document.getElementById('pointScale').value;

    console.log(pointScale);
    if(courseName !== '' && pointScale !== '')
    {
        let gradeType = getGradeTypeFromHTML(pointScale);
        addCourse(courseName, gradeType);
        updateViewCourseSection(courseName);
        console.log("i am in");
        updateStudentCourseSection(courseName);
    }
}
function getGradeTypeFromHTML(input)
{
    if (input === '10')
    {
        return GradingTypes.type1;
    }
    return GradingTypes.type2;
}

function updateViewCourseSection(courseName)
{

    let viewCourses = document.getElementById('viewCourses');
    let newCourse = document.createElement('option');
    
    newCourse.textContent = courseName;

    viewCourses.appendChild(newCourse);
}


function addStudentHTML()
{
    let courseName = document.getElementById('studentCourses').value;
    let studentId = parseInt(document.getElementById('studentID').value);
    let studentName = document.getElementById('studentName').value;
    let studentSurname = document.getElementById('studentSurname').value;
    let studentMidtermScore = parseInt(document.getElementById('midtermScore').value);
    let finalSCore = parseInt(document.getElementById('finalScore').value);
    console.log(courseName);
    console.log(studentId);
    console.log(studentName);
    console.log(studentSurname);
    console.log(studentMidtermScore);
    console.log(finalSCore);
    
    addStudentToCourse(courseName, studentId, studentName, 
        studentSurname, studentMidtermScore, finalSCore);

}

function updateStudentCourseSection(courseName)
{
    
    let viewCourses = document.getElementById('studentCourses');
    let newCourse = document.createElement('option');
    
    newCourse.textContent = courseName;

    viewCourses.appendChild(newCourse);
}


function viewStudentsHTML()
{
    let courseName = document.getElementById('viewCourses').value;
    let filter = document.getElementById('filterStudents').value;
    const selectedRadio = document.querySelector('input[name="detailedStats"]:checked');

    const selectedValue = selectedRadio ? selectedRadio.value : null;
    let resultArray;
    if(filter === 'failed')
    {
       resultArray =  getFailedStudents(getIdForLecture(courseName));
    }else if(filter === 'passed')
    {
        resultArray = getPassedStudents(getIdForLecture(courseName));
    }else{
        resultArray = getAllStudents(getIdForLecture(courseName));
    }
    updateScreen(resultArray);
    if(selectedValue === 'yes')
    {
        showDetailedStatistic(getDetailedStatistic(getIdForLecture(courseName)));
    }

}

function updateScreen(resultArray)
{
    let table = document.getElementById('resultTable');
    table.innerHTML = '';

    let tbody = document.createElement('tbody');
    let thead = document.createElement('thead');

    table.appendChild(tbody);
    table.appendChild(thead);

    const tr = document.createElement('tr');
    const columnValues = ["Student id", "Name","Surname","Midterm", "Final", "Total Score", "LetterGrade"];
    for(i=0; i<7; i++)
    {
        const th = document.createElement('th');
        th.textContent = columnValues[i];
        tr.appendChild(th);
    }
    thead.appendChild(tr);

    for(i=0; i<resultArray.length; i++)
    {
        const row = document.createElement('tr');
        for(j=0; j<resultArray[i].length; j++)
        {
            const td = document.createElement('td');
            td.textContent = resultArray[i][j];
            row.appendChild(td);
        }
        tbody.appendChild(row);
    }
}


function showDetailedStatistic(resultArray)
{
    let detailedTable = document.getElementById('detailedTable');
    let columnNames = ["Passed Students", "Failed Student", "Mean Score"];

    let tbody = document.createElement('tbody');
    let thead = document.createElement('thead');

    detailedTable.appendChild(thead);
    detailedTable.appendChild(tbody);

    let tr = document.createElement('tr');
    for(i=0; i<3; i++)
    {
        const th = document.createElement('th');
        th.textContent = columnNames[i];
        tr.appendChild(th);
    }
    thead.appendChild(tr);

    for(i=0; i<resultArray.length; i++)
    {
        const row = document.createElement('tr');
        for(j=0; j<resultArray[i].length; j++)
        {
            const td = document.createElement('td');
            td.textContent = resultArray[i][j];
            row.appendChild(td);
        }
        tbody.appendChild(row);
    }
}