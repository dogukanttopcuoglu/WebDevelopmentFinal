
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

console.log(getLetterGrade(GradingTypes.type1, 90, 60));





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

function getIdForLecture()
{
    incrementIdForLecture+=1
    return incrementIdForLecture -1;
}


function addCourse(courseName, gradeType)
{
    lectures.set(courseName, new Lecture(courseName, getIdForLecture(), gradeType));
}

let testLecture = new Lecture("test", 2, GradingTypes.type1);
console.log(testLecture.lectureName);
console.log(testLecture.lectureId);

addCourse("testLecture", GradingTypes.type1);
lectures.forEach((lecture, courseId, lectures) => {
    console.log(lecture.lectureName);
});

function addStudentToCourse(courseName, studentId, name, surname, midterm, final)
{
    let course = lectures.get(courseName);
    let newStudent = new StudentOfLecture(studentId, name, surname, midterm, final, getLetterGrade(course.gradingType, midterm, 
        final));
    studentsOfLecture.get(course.lectureId).set(studentId, newStudent);

    addCourseToStudent(course.lectureId, studentId, name, surname, newStudent.letterNote);
}

//returns boolean
function isStudentExist(courseId, studentId){
    return studentsOfLecture.get(courseId).has(studentId);
}


function addCourseToStudent(courseId, studentId, name, surname, letterNote)
{
    if(!students.has(studentId))
    {
        students.set(studentId, new Student(studentId, [], name, surname));
    }
    students.get(studentId).lectures.push(courseId);
    addLetterNoteToGpa(studentId, letterNote);
}
function addLetterNoteToGpa(studentId, letterNote)
{
    let student = students.get(studentId);
    let factorOfLetterGrade;
    switch(letterNote)
    {
        case "A":
            factorOfLetterGrade = 4;
            break;
        case "B":
            factorOfLetterGrade = 3;
            break;  
        case "C":
            factorOfLetterGrade = 2;
            break;
        case "D":
            factorOfLetterGrade = 1;
            break;
    }
    student.gpa = ((student.gpa * student.lectures.length) + factorOfLetterGrade) / (student.lectures.lenght);  
}
/* ReturnType : [[studentId, name, surname, midterm, final, totalScore, grade]] */
function getStudentsForLecture(courseName)
{
    /*array type [[studentId, name, surname, midterm, final, totalScore, grade]]*/
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


/* Return Type: [[studentId, name, surname, gpa]]
 * returns all students with given name and surname
*/
function searchStudent(studentName, studentSurname)
{
    let studentReturnArray = []
    students.forEach((student, studentId, students) => {
        if(student.name === studentName && student.surname === studentSurname)
        {
            studentReturnArray.push([student.studentId, student.name, student.surname, 
            student.gpa]);
        }
    });
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

/* returns mean Score of lecture */
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
