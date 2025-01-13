const address = "http://cat-facts-api.std-900.ist.mospolytech.ru/";
const api_key = "50a0367a-50c3-4b25-8fe0-966d4442fdd9";
export const getCourses = async () => {
  try {
    const response = await fetch(`${address}api/courses?api_key=${api_key}`);
    const ans = await response.json();
    return ans;
  }
  catch (e) {
    console.log(e);
  }
}

export const getTutors = async () => {
  try {
    const response = await fetch(`${address}api/tutors?api_key=${api_key}`);
    const ans = await response.json();
    return ans;
  }
  catch (e) {
    console.log(e);
  }
}

export const postOrder = async (params) => {
  try {
    const body = JSON.stringify({
    course_id: params.course_id,
    date_start: params.date_start,
    time_start: params.time_start,
    duration: params.duration,
    persons: params.persons,
    price: params.price,
    early_registration: params.early_registration,
    group_enrollment: params.group_enrollment,
    intensive_course: params.intensive_course,
    supplementary: params.supplementary,
    personalized: params.personalized,
    excursions: params.excursions,
    assessment: params.assessment,
    interactive: params.interactive,
    });
    const response = await fetch(`${address}api/orders?api_key=${api_key}`, {
      method: "POST", 
      headers: {
        'Content-Type': 'application/json'
      },
      body: body,
    });
    const ans = await response.json();
    if(response.status == 422) {
      throw new Error(ans.error);
    }
    return ans;
  }
  catch (e) {
    return {
      name: "error",
      message: e.message 
    }
  }
};