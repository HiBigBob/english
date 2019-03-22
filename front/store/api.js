
import qs from 'qs'

const BASE_URL = `http://localhost:5000`;

export async function getUser(token) {
  const url = `${BASE_URL}/user`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      "Authorization": `Bearer ${token}`
    },
  }).then(resp => resp.json());

  return response;
}

export async function getToken(user) {
  const URL = `${BASE_URL}/oauth/token`;
  const response = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ZW5nbGlzaC1hcHA6cHBhLWhzaWxnbmU='
    },
    body: qs.stringify({
      grant_type: 'password',
      scope: 'practice',
      username: user.email,
      password: user.password
    })
  }).then(resp => resp.json());

  return response;
}

