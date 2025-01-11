import { getCourses } from "./js/api/indexApi.js";
console.log(await getCourses());
const courses = await getCourses();
// const courses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const changePage = (pageNum) => {
  let correctCourses = [];
  for (let i = pageNum * 3 - 3; i < pageNum * 3; i++) {
    correctCourses.push(courses[i].name);
    if(courses.length === i + 1) {
      break;
    }
  }
  console.log(correctCourses);
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
    console.log(listEl.textContent);
    for (let course of courses) {
      if (course.name == listEl.textContent) {
        document.getElementById('opted-course').style.display = 'block';
        listEl.style.color = 'green';
        document.getElementById('course-info').innerHTML = 'Название: ' + course.name + '<br>Описание: ' + course.description +
        '<br> Уровень: ' + course.level + '<br> Преподаватель: ' + course.teacher;
      }
    }
  })
}