const address = "http://cat-facts-api.std-900.ist.mospolytech.ru/";
const api_key = "50a0367a-50c3-4b25-8fe0-966d4442fdd9";
export const getCourses = async () => {
  try {
    const response = await fetch(`${address}api/courses?api_key=${api_key}`, {
    });
    const ans = await response.json();
    return ans;
  }
  catch (e) {
    console.log(e);
  }
}

export const getTutors = async () => {
  try {
    const response = await fetch(`${address}api/tutors?api_key=${api_key}`, {
    });
    const ans = await response.json();
    return ans;
  }
  catch (e) {
    console.log(e);
  }
}