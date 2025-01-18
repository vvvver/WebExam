import { deleteOrder, getOrder, getOrders, putOrder } from "../api/cabinetApi.js";
import { getCourses } from "../api/indexApi.js";
let orders = await getOrders();
const courses = await getCourses();
// console.log(orders);
console.log(courses);

const notif = document.getElementById('notif');
notif.style.display = 'none';

const nameCourse = document.getElementById('course-name');
const startDate = document.getElementById('start-date');
const startTime = document.getElementById('start-time');
const courseDuration = document.getElementById('duration');
const studentNum = document.getElementById('students-num');

const name_course = document.getElementById('course-name-edit');
const start_date = document.getElementById('start-date-edit');
const start_time = document.getElementById('start-time-edit');
const course_duration = document.getElementById('duration-edit');
const student_num = document.getElementById('students-num-edit');
const totalCostP = document.getElementById('cost');

const earlyRegCheckBox = document.getElementById('early-reg');
const groupEnrollCheckBox = document.getElementById('group-enrollment');
const intensiveCourseCheckBox = document.getElementById('intensive-course');
const supplementaryCheckBox = document.getElementById('supplementary'); 
const personalCheckBox = document.getElementById('personalized');
const excursionsCheckBox = document.getElementById('excursions');
const assessmentCheckBox = document.getElementById('assessment');
const interactiveCheckBox = document.getElementById('interactive');

const seeOrderModal = document.getElementsByClassName('modal-back')[0];
const editOrderModal = document.getElementsByClassName('modal-back')[1];
const delOrderModal = document.getElementsByClassName('modal-back')[2];
const modals = (seeBut, editBut, delBut) => {
  seeBut.addEventListener('click', async () => {
    const order = await getOrder(seeBut.dataset.order_id);
    console.log(order);
    const name = courses.filter(el => el.id == order.course_id)[0].name;
    nameCourse.innerHTML = name;
    startDate.innerHTML = order.date_start;
    startTime.innerHTML = order.time_start.slice(0, 5);
    courseDuration.innerHTML = order.duration;
    studentNum.innerHTML = order.persons;
    const optionParent = document.getElementById('options-block');
    optionParent.replaceChildren();
    if (order.early_registration == true) {
      const el = document.createElement('p');
      el.innerHTML = 'Скидка за раннюю регистрация';
      optionParent.appendChild(el);
    }
    if (order.group_enrollment == true) {
      const el = document.createElement('p');
      el.innerHTML = 'Скидка при групповой записи';
      optionParent.appendChild(el);
    }
    if (order.intensive_course == true) {
      const el = document.createElement('p');
      el.innerHTML = 'Интенсивные курсы';
      optionParent.appendChild(el);
    }
    if (order.supplementary == true) {
      const el = document.createElement('p');
      el.innerHTML = 'Допольнительные учебные материалы';
      optionParent.appendChild(el);
    }
    if (order.personalized == true) {
      const el = document.createElement('p');
      el.innerHTML = 'Индивидуальные занятия';
      optionParent.appendChild(el);
    }
    if (order.excursion == true) {
      const el = document.createElement('p');
      el.innerHTML = 'Культурные экскурсии';
      optionParent.appendChild(el);
    }
    if (order.assessment == true) {
      const el = document.createElement('p');
      el.innerHTML = 'Оценка уровня владения языком';
      optionParent.appendChild(el);
    }
    if (order.interactive == true) {
      const el = document.createElement('p');
      el.innerHTML = 'Доступ к интерактивной онлайн-платформе';
      optionParent.appendChild(el);
    }
    totalCostP.innerHTML = 'Общая стоимость: ' + order.price + 'р';
    seeOrderModal.style.display = 'block';
  })

  editBut.addEventListener('click', async() => {
    editOrderModal.style.display = 'block';
    const order = await getOrder(editBut.dataset.order_id);
    console.log(order);
    const name = courses.filter(el => el.id == order.course_id)[0].name;
    name_course.innerHTML = name;

    const selectDateParent = document.getElementById('start-date-edit');
    selectDateParent.replaceChildren();
    const optedOptionDate = document.createElement('option');
    // добавление выбранной даты
    let date = new Date (order.date_start);
    optedOptionDate.innerHTML = `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth()+ 1).padStart(2, '0')}.${date.getFullYear()}`;
    optedOptionDate.value = order.date_start;
    selectDateParent.appendChild(optedOptionDate);
    
    const selectTimeParent = document.getElementById('start-time-edit');
    selectTimeParent.replaceChildren();

    //добавление выбранного времени 
    const optedOptionTime = document.createElement('option');
    optedOptionTime.innerHTML = order.time_start.slice(0, 5);
    optedOptionTime.value = order.time_start.slice(0, 5);
    selectTimeParent.appendChild(optedOptionTime);
    
    //добавление остальных дат
    for (const course of courses) {
      if (course.id == order.course_id) {
        const dates = [];
        let correctDates = new Set();
        for (const startDates of course.start_dates) {
          if(startDates.slice(0, 10) != optedOptionDate.value) {
            dates.push(startDates.slice(0, 10));
            correctDates = new Set(dates);
            //добавление остальных часов
            if (startDates.slice(11, 16) != optedOptionTime.value) {
              const optionTime = document.createElement('option');
              optionTime.value = startDates.slice(11, 16);
              optionTime.innerHTML = startDates.slice(11, 16);
              selectTimeParent.appendChild(optionTime);
            }
          }
        }
        for (const correctDate of correctDates) {
          let date = new Date (correctDate);
          const optionDate = document.createElement('option');
          optionDate.value = correctDate.slice(0, 10);
          optionDate.innerHTML = `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth()+ 1).padStart(2, '0')}.${date.getFullYear()}`;
          selectDateParent.appendChild(optionDate);
        }
      }
    }
    start_date.addEventListener('change', () => {
      const now = new Date();
      let date = new Date(start_date.value);
      if ((date.getMonth() - now.getMonth() == 1 && date.getDate() >= now.getDate()) ||
        date.getMonth() - now.getMonth() > 1) {
        earlyRegCheckBox.checked = true;
      } else {
        earlyRegCheckBox.checked = false;
      }
    })
    student_num.addEventListener('change', () => {
      if (student_num.value >= 5) {
        groupEnrollCheckBox.checked = true;
      } else {
        groupEnrollCheckBox.checked = false;
      }
    })
    course_duration.innerHTML = order.duration + ' часов';
    student_num.value = order.persons;
    
    if (order.early_registration == true) {
      earlyRegCheckBox.checked = true;
    }
    if (order.group_enrollment == true) {
      groupEnrollCheckBox.checked = true;
    }
    if (order.intensive_course == true) {
      intensiveCourseCheckBox.checked = true;
    }
    if (order.supplementary == true) {
      supplementaryCheckBox.checked = true;
    }
    if (order.personalized == true) {
      personalCheckBox.checked = true;
    }
    if (order.excursion == true) {
      excursionsCheckBox.checked = true;
    }
    if (order.assessment == true) {
      assessmentCheckBox.checked = true;
    }
    if (order.interactive == true) {
      interactiveCheckBox.checked = true;
    }
    document.getElementById('send').addEventListener('click', async() => {
      priceCount();
      const data = {
        date_start: start_date.value,
        time_start: start_time.value,
        persons: Number(student_num.value),
        price: totalCostWithOption,
        isEarlyRegistration: earlyRegCheckBox.checked,
        isGroupEnrollment: groupEnrollCheckBox.checked,
        isIntensiveCourse: intensiveCourseCheckBox.checked,
        isSupplementary: supplementaryCheckBox.checked,
        isPersonalized: personalCheckBox.checked,
        isExcursions: excursionsCheckBox.checked,
        isAssessment: assessmentCheckBox.checked,
        isInteractive: interactiveCheckBox.checked,
      }
      try {
        checkOrder();
        const ans = await putOrder(data, editBut.dataset.order_id);
        console.log(ans);
        editOrderModal.style.display = 'none';
        orders = await getOrders();
        changePage(Number(sessionStorage.getItem('pagenum')));
        notif.innerHTML = 'Заказ успешно изменен';
        notif.style.display = 'block';
        setTimeout(() => {
          notif.style.display = 'none';
        }, 5000);
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
  })

  delBut.addEventListener('click', () => {
    delOrderModal.style.display = 'block';
    document.getElementById('cancel').addEventListener('click', () => {
      delOrderModal.style.display = 'none';
    })
    document.getElementById('yes-but').addEventListener('click', async() => {
      const ans = await deleteOrder(delBut.dataset.order_id);
      delOrderModal.style.display = 'none';
      console.log(ans);
      
      orders = await getOrders();
      pages();
      changePage(Number(sessionStorage.getItem('pagenum')));
      notif.innerHTML = 'Заказ успешно удален';
      notif.style.display = 'block';
      setTimeout(() => {
        notif.style.display = 'none';
      }, 5000);
    })
  })
}

let totalCostWithOption = 0;
const priceCount = () => {
  let totalCost = 0;
  let courseFeePerHour = 0;
  let durationInHours = 0;
  let isWeekend = 0;
  let morningSurchage = 0;
  let eveningSurchage = 0;
  let studsNum = student_num.value;
  let date = new Date(start_date.value);
  let dayWeek = [7, 1, 2, 3, 4, 5, 6][date.getDay()];
  let time = Number(start_time.value.split(':')[0]);

  let earlyReg = 0;
  let groupEnroll = 0;
  let intensiveCourse = 0;
  let supplementary = 0;
  let personalized = 0;
  let excursions = 0;
  let assessment = 0;
  let interactive = 0;
  for (const course of courses) {
    if (course.name == name_course.textContent) {
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

const checkOrder = () => {
  if (start_date.value == '') {
    throw new Error('Выберите дату начала курса');
  } else {
    if (student_num.value == '') {
      throw new Error('Введите количество студентов');
    } else {
      if (student_num.value > 20 || student_num.value < 1 || Number.isInteger(Number(student_num.value)) == false) {
        throw new Error('Количество студентов в диапазоне от 1 до 20 (целое число)');
      }
    }
  }
}

document.getElementById('calc-sum').addEventListener('click', () => {
  try {
    checkOrder(start_date, student_num);
    priceCount();
    totalCostP.innerHTML = "Общая стоимость: " + totalCostWithOption + 'р';
  } catch (e) {
    alert(e);
  }
})


const changePage = (pageNum) => {
  let correctOrders = [];
  for (let i = pageNum * 4 - 4; i < pageNum * 4; i++) {
    correctOrders.push(orders[i]);
    if(orders.length === i + 1) {
      break;
    }
  }
  const parent = document.getElementById('order-history');
  Array.from(parent.children).filter((el, index) => index != 0).map(el => parent.removeChild(el));

  for (let i = 0; i < correctOrders.length; i++) {
    const order = correctOrders[i];
    const name = courses.filter(el => el.id == order.course_id)[0].name;

    const courseParent = document.createElement('tr');
  
    const orderNum = document.createElement('td');
    orderNum.innerHTML = pageNum * 4 - 3 + i;
    courseParent.appendChild(orderNum);
  
    const orderName = document.createElement('td');
    orderName.innerHTML = name;
    courseParent.appendChild(orderName);
  
    const orderDate = document.createElement('td');
    const date = new Date(order.date_start);
    orderDate.innerHTML = `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth()+ 1).padStart(2, '0')}.${date.getFullYear()}`;
    courseParent.appendChild(orderDate);
  
    const orderPrice = document.createElement('td');
    orderPrice.innerHTML = order.price + 'р';
    courseParent.appendChild(orderPrice);
  
    const orderActions = document.createElement('td');
    orderActions.classList.add('action-block')
  
    const seeBut = document.createElement('button');
    seeBut.classList.add('see-order');
    const eye = document.createElement('img');
    eye.classList.add('action-img');
    eye.src = '../src/eye.svg';
    seeBut.dataset.order_id = order.id;
    seeBut.appendChild(eye);
  
    const editBut = document.createElement('button');
    editBut.classList.add('edit-order');
    const pencil = document.createElement('img');
    pencil.classList.add('action-img');
    pencil.src = '../src/pencil.svg';
    editBut.dataset.order_id = order.id;
    editBut.appendChild(pencil);
  
    const deleteBut = document.createElement('button');
    deleteBut.classList.add('del-order');
    deleteBut.dataset.order_id = order.id;
    const trash = document.createElement('img');
    trash.classList.add('action-img');
    trash.src = '../src/trash3.svg';
    deleteBut.appendChild(trash);
    
    modals(seeBut, editBut, deleteBut);
  
    orderActions.appendChild(seeBut);
    orderActions.appendChild(editBut);
    orderActions.appendChild(deleteBut);
    
    courseParent.appendChild(orderActions);
    parent.appendChild(courseParent);
  }
}
changePage(1);

const pages = () => {
  const parent = document.getElementById('pages');
  parent.replaceChildren();
  for (let i = 1; i <= Math.ceil(orders.length/4); i++) {
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
      sessionStorage.setItem('pagenum', pageNum);
      changePage(pageNum);    
    })
    parent.appendChild(li);
  }
}
pages();


for (const el of document.getElementsByClassName('x')) {
  el.addEventListener('click', () => {
    seeOrderModal.style.display = 'none';
    delOrderModal.style.display = 'none';
    editOrderModal.style.display = 'none';
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
}


for (const cancelBut of document.getElementsByClassName('cancel')){
  cancelBut.addEventListener('click', () => {
    seeOrderModal.style.display = 'none';
    delOrderModal.style.display = 'none';
    editOrderModal.style.display = 'none';
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
}