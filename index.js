import { getCourses, getTutors, postOrder } from "./js/api/indexApi.js";
console.log(await getCourses());
const courses = await getCourses();
const tutors = await getTutors();
console.log(tutors);
// const courses = [1, 1, 3, 1, 5, 6, 7, 8, 9, 10];

const courseClick = (listEl) => {
  listEl.addEventListener('click', () => {
    const parent = document.getElementById('course-info');
    parent.replaceChildren();
    for (let course of courses) {
      if (course.name == listEl.textContent) {
        document.getElementById('opted-course').style.display = 'block';
        const courseInfo = document.createElement('li');
        courseInfo.dataset.course_id = course.id;
        courseInfo.classList.add('list-group-item');
        courseInfo.innerHTML = 'Название: ' + course.name + '<br>Описание: ' + course.description +
        '<br> Уровень: ' + course.level + '<br> Преподаватель: ' + course.teacher;
        parent.appendChild(courseInfo);

        courseBut.addEventListener('click', () => {
          const selectDateParent = document.getElementById('start-date');
          const emptyOptionDate = document.createElement('option');
          selectDateParent.replaceChildren();
          emptyOptionDate.innerHTML = '--Выберите дату начала--';
          emptyOptionDate.value = '';
          selectDateParent.appendChild(emptyOptionDate);

          const selectTimeParent = document.getElementById('start-time');
          const emptyOptionTime = document.createElement('option');
          selectTimeParent.replaceChildren();
          emptyOptionTime.innerHTML = '--Выберите дату начала--';
          emptyOptionTime.value = '';
          selectTimeParent.appendChild(emptyOptionTime);
          makeOrderModal.style.display = 'block';
          nameCourse.innerHTML = course.name;
          nameCourse.dataset.course_id = course.id;
          nameTeacher.innerHTML = course.teacher;
          const dates = [];
          let correctDates = new Set();
          for (const startDates of course.start_dates) {
            dates.push(startDates.slice(0, 10));
            correctDates = new Set(dates);
          }
          for (const correctDate of correctDates) {
            let date = new Date (correctDate);
            const optionDate = document.createElement('option');
            optionDate.value = correctDate.slice(0, 10);
            optionDate.innerHTML = `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth()+ 1).padStart(2, '0')}.${date.getFullYear()}`;
            selectDateParent.appendChild(optionDate);
          }
          startDate.addEventListener('change', (e) => {
            const dateValue = e.target.value;
            selectTimeParent.replaceChildren();
            if (dateValue != '') {
              startTime.disabled = false;
              for (const startDates of course.start_dates) {
                if (startDates.slice(0, 10) == dateValue) {
                  let date = new Date(startDates);
                  let finishTime = new Date(date);
                  let finishDate = new Date(date);

                  finishDate.setDate(finishDate.getDate() + course.total_length * 7); 
                  finishTime.setHours(finishTime.getHours() + 2); 
                  const optionTime = document.createElement('option');
                  optionTime.value = startDates.slice(11, 16);
                  optionTime.innerHTML = `c ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}
                    до ${String(finishTime.getHours()).padStart(2, '0')}:${String(finishTime.getMinutes()).padStart(2, '0')}`;
                  selectTimeParent.appendChild(optionTime);
                  courseDuration.innerHTML = course.total_length + ' недель, ' + `последнее занятие: ${String(finishDate.getDate()).padStart(2, '0')}.${String(finishDate.getMonth() + 1).padStart(2, '0')}.${finishDate.getFullYear()}`;
                  courseDuration.dataset.total_length = course.total_length;
                  courseDuration.dataset.week_length = course.week_length;
                }
              }
            } else {
              startTime.disabled = true;
              courseDuration.innerHTML = '';
            }
            const now = new Date();
            let date = new Date(startDate.value);
            if ((date.getMonth() - now.getMonth() == 1 && date.getDate() >= now.getDate()) ||
              date.getMonth() - now.getMonth() > 1) {
              earlyRegCheckBox.checked = true;
            } else {
              earlyRegCheckBox.checked = false;
            }
          })
          studentNum.addEventListener('change', () => {
            if (studentNum.value >= 5) {
              groupEnrollCheckBox.checked = true;
            } else {
              groupEnrollCheckBox.checked = false;
            }
          })

          if (course.week_length > 20) {
            intensiveCourseCheckBox.checked = true;
          } else {
            intensiveCourseCheckBox.checked = false;
          }
        })
      }
    }
  })
} 

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
    courseClick(li);
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

const earlyRegCheckBox = document.getElementById('early-reg');
const groupEnrollCheckBox = document.getElementById('group-enrollment');
const intensiveCourseCheckBox = document.getElementById('intensive-course');
const supplementaryCheckBox = document.getElementById('supplementary'); 
const personalCheckBox = document.getElementById('personalized');
const excursionsCheckBox = document.getElementById('excursions');
const assessmentCheckBox = document.getElementById('assessment');
const interactiveCheckBox = document.getElementById('interactive');

const checkOrder = () => {
  if (startDate.value == '') {
    throw new Error('Выберите дату начала курса');
  } else {
    if (studentNum.value == '') {
      throw new Error('Введите количество студентов');
    } else {
      if (studentNum.value > 20 || studentNum.value < 1 || Number.isInteger(Number(studentNum.value)) == false) {
        throw new Error('Количество студентов в диапазоне от 1 до 20 (целое число)');
      }
    }
  }
}

const totalCostP = document.getElementById('total-cost');
let totalCostWithOption = 0;
const priceCount = () => {
  let totalCost = 0;
  let courseFeePerHour = 0;
  let durationInHours = 0;
  let isWeekend = 0;
  let morningSurchage = 0;
  let eveningSurchage = 0;
  let studsNum = studentNum.value;
  let date = new Date(startDate.value);
  let dayWeek = [7, 1, 2, 3, 4, 5, 6][date.getDay()];
  let time = Number(startTime.value.split(':')[0]);

  let earlyReg = 0;
  let groupEnroll = 0;
  let intensiveCourse = 0;
  let supplementary = 0;
  let personalized = 0;
  let excursions = 0;
  let assessment = 0;
  let interactive = 0;
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

      if (earlyRegCheckBox.checked == true) {
        earlyReg = totalCost * 0.1;
      }
      if (groupEnrollCheckBox.checked == true) {
        groupEnroll = totalCost * 0.15;
      }
      if (intensiveCourseCheckBox.checked == true) {
        intensiveCourse = totalCost * 0.2;
      }
      if (supplementaryCheckBox.checked == true) {
        supplementary = 2000;
      }
      if (personalCheckBox.checked == true) {
        personalized = course.total_length * 1500;
      }
      if(excursionsCheckBox.checked == true) {
        excursions = totalCost * 0.25;
      }
      if(assessmentCheckBox.checked == true) {
        assessment = 300;
      }
      if (interactiveCheckBox.checked == true) {
        interactive = totalCost * 1.5;
      }
      totalCostWithOption = totalCost - earlyReg - groupEnroll + intensiveCourse +
      supplementary + personalized + excursions + assessment + interactive;
    } 
  } 
}

document.getElementById('calc-sum').addEventListener('click', () => {
  try {
    checkOrder();
    priceCount();
    totalCostP.innerHTML = "Общая стоимость: " + totalCostWithOption + 'р';
  } catch (e) {
    alert(e);
  }
  
})

document.getElementById('send').addEventListener('click', async() => {
  const duration = courseDuration.dataset.week_length * courseDuration.dataset.total_length;
  priceCount();
  const data = {
    course_id: Number(nameCourse.dataset.course_id),
    date_start: startDate.value,
    time_start: startTime.value,
    duration: duration,
    persons: Number(studentNum.value),
    price: totalCostWithOption,
    early_registration: earlyRegCheckBox.checked,
    group_enrollment: groupEnrollCheckBox.checked,
    intensive_course: intensiveCourseCheckBox.checked,
    supplementary: supplementaryCheckBox.checked,
    personalized: personalCheckBox.checked,
    excursions: excursionsCheckBox.checked,
    assessment: assessmentCheckBox.checked,
    interactive: intensiveCourseCheckBox.checked,
  }
  try {
    checkOrder();
    const ans = await postOrder(data);
    console.log(ans);
    makeOrderModal.style.display = 'none';
    setTimeout(() => {alert('Заказ успешно создан')}, 1);
    courseDuration.innerHTML = '';
    startTime.disabled = true;
    studentNum.value = '';
    earlyRegCheckBox.checked = false;
    groupEnrollCheckBox.checked = false;
    intensiveCourseCheckBox.checked = false;
    supplementaryCheckBox.checked = false;
    personalCheckBox.checked = false;
    excursionsCheckBox.checked = false;
    assessmentCheckBox.checked = false;
    interactiveCheckBox.checked = false;
    totalCostP.innerHTML = "Общая стоимость: ";
  } catch(e) {
    alert(e);
  }
})

document.getElementsByClassName('x')[0].addEventListener('click', () => {
  makeOrderModal.style.display = 'none';
  courseDuration.innerHTML = '';
  startTime.disabled = true;
  studentNum.value = '';
  earlyRegCheckBox.checked = false;
  groupEnrollCheckBox.checked = false;
  intensiveCourseCheckBox.checked = false;
  supplementaryCheckBox.checked = false;
  personalCheckBox.checked = false;
  excursionsCheckBox.checked = false;
  assessmentCheckBox.checked = false;
  interactiveCheckBox.checked = false;
  totalCostP.innerHTML = "Общая стоимость: ";
})

document.getElementById('cancel-but').addEventListener('click', () => {
  makeOrderModal.style.display = 'none';
  courseDuration.innerHTML = '';
  startTime.disabled = true;
  studentNum.value = '';
  earlyRegCheckBox.checked = false;
  groupEnrollCheckBox.checked = false;
  intensiveCourseCheckBox.checked = false;
  supplementaryCheckBox.checked = false;
  personalCheckBox.checked = false;
  excursionsCheckBox.checked = false;
  assessmentCheckBox.checked = false;
  interactiveCheckBox.checked = false;
  totalCostP.innerHTML = "Общая стоимость: ";
})


const searchCourse = document.getElementById('search-course');
searchCourse.addEventListener('click', () => {
  let courseName = document.getElementById('course').value;
  document.getElementById('course').value = '';
  const searchLevel = document.getElementById('level').value;
  document.getElementById('level').value = ''; 
  const searchedCourse = document.getElementById('searched-course');
  const parentCourse = document.getElementById('search-course-info');
  parentCourse.replaceChildren();
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
      // for (const tutor of tutors) {
      //   if (course.level == tutor.language_level) {
      //     const tutorInfo = document.createElement('li');
      //     tutorInfo.classList.add('list-group-item');
      //     searchedTutor.style.display = 'block';
      //     tutorInfo.innerHTML = 'Имя: ' + tutor.name + ', Опыт работы: ' + tutor.work_experience;
      //     parentTutor.appendChild(tutorInfo);
      //   }
      // }
    } else {
      if (course.level == searchLevel) {
        const courseInfo = document.createElement('li');
        courseInfo.classList.add('list-group-item');
        searchedCourse.style.display = 'block';
        courseInfo.innerHTML = 'Название: ' + course.name;
        parentCourse.appendChild(courseInfo);
      }
      // for (const tutor of tutors) {
      //   if (searchLevel == tutor.language_level) {
      //     const tutorInfo = document.createElement('li');
      //     tutorInfo.classList.add('list-group-item');
      //     searchedTutor.style.display = 'block';
      //     tutorInfo.innerHTML = 'Имя: ' + tutor.name + ', Опыт работы: ' + tutor.work_experience;
      //     parentTutor.appendChild(tutorInfo);
      //   }
      // } 
    }
  }
})