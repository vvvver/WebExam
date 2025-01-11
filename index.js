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

for (const listEl of document.getElementById('list-courses').childNodes) {
  listEl.addEventListener('click', () => {
    for (let course of courses) {
      if (course.name == listEl.textContent) {
        document.getElementById('opted-course').style.display = 'block';
        const parent = document.getElementById('course-info');
        const courseInfo = document.createElement('li');
        courseInfo.classList.add('list-group-item');
        courseInfo.innerHTML = 'Название: ' + course.name + '<br>Описание: ' + course.description +
        '<br> Уровень: ' + course.level + '<br> Преподаватель: ' + course.teacher;
        parent.appendChild(courseInfo);
      }
    }
  })
}

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
