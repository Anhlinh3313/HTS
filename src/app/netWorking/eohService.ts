export async function getToken(username: string, password: string) {
  // const token = await _getToken();
  return await new Promise((resolve, reject) => {
    fetch(`https://backend.eoh.io/api/accounts/login/`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then(async response => {
        if (response.status === 200) {
          return await response.json();
        }
      })
      .then(async responseJson => {
        resolve(responseJson);
      })
      .catch(error => {
        resolve(null);
        alert(`${error.message}`);
        reject(error);
      });
  });
}
