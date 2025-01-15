const address = "http://cat-facts-api.std-900.ist.mospolytech.ru/";
const api_key = "50a0367a-50c3-4b25-8fe0-966d4442fdd9";
export const getOrders = async () => {
  try {
    const response = await fetch(`${address}api/orders?api_key=${api_key}`);
    const ans = await response.json();
    return ans;
  }
  catch (e) {
    console.log(e);
  }
}

export const getOrder = async (param) => {
  try {
    const response = await fetch(`${address}api/orders/${param}?api_key=${api_key}`);
    const ans = await response.json();
    return ans;
  }
  catch (e) {
    console.log(e);
  }
}

export const deleteOrder = async (param) => {
  try {
    const response = await fetch(`${address}api/orders/${param}?api_key=${api_key}`, {
      method: "DELETE",
    });
    const ans = await response.json();
    return ans;
  }
  catch (e) {
    console.log(e);
  }
}

export const putOrder = async (params, param) => {
  try {
    const body = JSON.stringify({
    date_start: params.date_start,
    time_start: params.time_start,
    persons: params.persons,
    price: params.price,
    early_registration: params.isEarlyRegistration,
    group_enrollment: params.isGroupEnrollment,
    intensive_course : params.isIntensiveCourse,
    supplementary: params.isSupplementary,
    personalized: params.isPersonalized,
    excursions: params.isExcursions,
    assessment: params.isAssessment,
    interactive: params.isInteractive,
    });
    const response = await fetch(`${address}api/orders/${param}?api_key=${api_key}`, {
      method: "PUT", 
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