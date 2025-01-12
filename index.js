import { getCourses, getTutors } from "./js/api/indexApi.js";
console.log(await getCourses());
const courses = await getCourses();
const tutors = await getTutors();
console.log(tutors);
// const courses = [1, 1, 3, 1, 5, 6, 7, 8, 9, 10];

const changePage = (pageNum) => {
  let correctCourses = [];
  for (let i = pageNum * 3 - 3; i < pageNum * 3; i++) {
    correctCourses.push(courses[i].name);
    if(courses.length === i + 1) {
      break;
    }
  }
  const parent = document.getElementById('list-courses');
  parent.replaceChildren();
  for (let i = 0; i < correctCourses.length; i++) {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    li.innerHTML = correctCourses[i];
    parent.appendChild(li);
  }
}
changePage(1);

for (let i = 1; i <= Math.ceil(courses.length/3); i++) {
  const li = document.createElement('li');
  li.classList.add('page-item');
  const a = document.createElement('a');
  a.innerHTML = i;
  a.classList.add('page-link');
  a.href = "";
  li.appendChild(a);
  li.dataset.num = i;
  li.addEventListener('click', (e) => {
    e.preventDefault();
    const pageNum = e.currentTarget.dataset.num;
    changePage(pageNum);
  })
  const parent = document.getElementById('pages');
  parent.appendChild(li);
}

const makeOrderModal = document.getElementsByClassName('modal-back')[0];
const courseBut = document.getElementById('make-order-but');

const nameCourse = document.getElementById('course-name');
const nameTeacher = document.getElementById('teacher-name');
const startDate = document.getElementById('start-date');
const startTime = document.getElementById('start-time');
const courseDuration = document.getElementById('duration');
const studentNum = document.getElementById('students-num');

for (const listEl of document.getElementById('list-courses').childNodes) {
  listEl.addEventListener('click', () => {
    const parent = document.getElementById('course-info');
    parent.replaceChildren();
    for (let course of courses) {
      if (course.name == listEl.textContent) {
        document.getElementById('opted-course').style.display = 'block';
        const courseInfo = document.createElement('li');
        courseInfo.classList.add('list-group-item');
        courseInfo.innerHTML = 'Название: ' + course.name + '<br>Описание: ' + course.description +
        '<br> Уровень: ' + course.level + '<br> Преподаватель: ' + course.teacher;
        parent.appendChild(courseInfo);

        const selectDateParent = document.getElementById('start-date');
        const emptyOptionDate = document.createElement('option');
        selectDateParent.replaceChildren();
        emptyOptionDate.innerHTML = '--Выберите дату начала--';
        emptyOptionDate.value = '';
        selectDateParent.appendChild(emptyOptionDate);

        const selectTimeParent = document.getElementById('start-time');

        courseBut.addEventListener('click', () => {
          makeOrderModal.style.display = 'block';
          nameCourse.innerHTML = course.name;
          nameTeacher.innerHTML = course.teacher;
          const dates = [];
          let correctDates = new Set();
          for (const startDates of course.start_dates) {
            dates.push(startDates.slice(0, 10));
            correctDates = new Set(dates);
          }
          for (const correctDate of correctDates) {
            const [year, day, month] = correctDate.split("-");
            const formedDate = `${year}-${month}-${day}`;
            let date = new Date (formedDate);
            const optionDate = document.createElement('option');
            optionDate.value = correctDate.slice(0, 10);
            optionDate.innerHTML = `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth()+ 1).padStart(2, '0')}.${date.getFullYear()}`;
            selectDateParent.appendChild(optionDate);
          }
          startDate.addEventListener('change', (e) => {
            selectTimeParent.replaceChildren();
            const dateValue = e.target.value;
            console.log(dateValue);
            if (dateValue != '') {
              startTime.disabled = false;
              for (const startDates of course.start_dates) {
                if (startDates.slice(0, 10) == dateValue) {
                  let time = new Date(startDates);
                  const [year, day, month] = startDates.slice(0, 10).split("-");
                  const formedDate = `${year}-${month}-${day}`;
                  let date = new Date(formedDate);
                  let finishTime = new Date(time);
                  let finishDate = new Date(date);

                  finishDate.setDate(finishDate.getDate() + course.total_length * 7); 
                  finishTime.setHours(finishTime.getHours() + 2); 
                  const optionTime = document.createElement('option');
                  optionTime.value = startDates.slice(11);
                  optionTime.innerHTML = `c ${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}
                    до ${String(finishTime.getHours()).padStart(2, '0')}:${String(finishTime.getMinutes()).padStart(2, '0')}`;
                  selectTimeParent.appendChild(optionTime);
                  courseDuration.innerHTML = course.total_length + ' недель, ' + `последнее занятие: ${String(finishDate.getDate()).padStart(2, '0')}.${String(finishDate.getMonth() + 1).padStart(2, '0')}.${finishDate.getFullYear()}`;
                }
              }
            } else {
              startTime.disabled = true;
            }
          })
        })
      }
    }
  })
}

const totalCostP = document.getElementById('total-cost');
document.getElementById('calc-sum').addEventListener('click', () => {
  startDate.oninvalid = (e) => {
    e.target.setCustomValidity (
        e.target.validity.patternMismatch ? 'Введите данные в требуемом формате.' : '');
  }
  let totalCost = 0;
  let courseFeePerHour = 0;
  let durationInHours = 0;
  let isWeekend = 0;
  let morningSurchage = 0;
  let eveningSurchage = 0;
  let studsNum = studentNum.value;
  const [year, day, month] = startDate.value.split("-");
  const formedDate = `${year}-${month}-${day}`;
  let date = new Date(formedDate);
  let dayWeek = [7, 1, 2, 3, 4, 5, 6][date.getDay()];
  let time = Number(startTime.value.split(':')[0]);
  for (const course of courses) {
    if (course.name == nameCourse.textContent) {
      courseFeePerHour = course.course_fee_per_hour;
      durationInHours = course.total_length * course.week_length;
      if (dayWeek == 6 || dayWeek == 7) {
        isWeekend = 1.5;
      } else {
        isWeekend = 1;
      }
      if (time == 9) {
        morningSurchage = 400;
      }
      if (time == 18) {
        eveningSurchage = 1000;
      }
      totalCost = ((courseFeePerHour * durationInHours * isWeekend)
       + morningSurchage + eveningSurchage) * studsNum;
      totalCostP.innerHTML = "Общая стоимость: " + totalCost;
    }
  }
})


const searchCourse = document.getElementById('search-course');
searchCourse.addEventListener('click', () => {
  let courseName = document.getElementById('course').value;
  document.getElementById('course').value = '';
  const searchLevel = document.getElementById('level').value;
  document.getElementById('level').value = ''; 
  const searchedCourse = document.getElementById('searched-course');
  const searchedTutor = document.getElementById('searched-tutor');
  const parentCourse = document.getElementById('search-course-info');
  const parentTutor = document.getElementById('search-tutor-info');
  parentCourse.replaceChildren();
  parentTutor.replaceChildren();
  for (const course of courses) {
    if (courseName != "") {
      if (course.name == courseName) {
        const courseInfo = document.createElement('li');
        courseInfo.classList.add('list-group-item');
        searchedCourse.style.display = 'block';
        courseInfo.innerHTML = 'Название: ' + course.name + '<br>Описание: ' + course.description +
        '<br> Уровень: ' + course.level + '<br> Преподаватель: ' + course.teacher;
        parentCourse.appendChild(courseInfo);
      }
      for (const tutor of tutors) {
        if (course.level == tutor.language_level) {
          const tutorInfo = document.createElement('li');
          tutorInfo.classList.add('list-group-item');
          searchedTutor.style.display = 'block';
          tutorInfo.innerHTML = 'Имя: ' + tutor.name + ', Опыт работы: ' + tutor.work_experience;
          parentTutor.appendChild(tutorInfo);
        }
      }
    } else {
      if (course.level == searchLevel) {
        const courseInfo = document.createElement('li');
        courseInfo.classList.add('list-group-item');
        searchedCourse.style.display = 'block';
        courseInfo.innerHTML = 'Название: ' + course.name;
        parentCourse.appendChild(courseInfo);
      }
      for (const tutor of tutors) {
        if (searchLevel == tutor.language_level) {
          const tutorInfo = document.createElement('li');
          tutorInfo.classList.add('list-group-item');
          searchedTutor.style.display = 'block';
          tutorInfo.innerHTML = 'Имя: ' + tutor.name + ', Опыт работы: ' + tutor.work_experience;
          parentTutor.appendChild(tutorInfo);
        }
      } 
    }
  }
})
