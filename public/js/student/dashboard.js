async function INIT() {
    // Also get Student info to Show in the Header (Atleast FirstName)
    // Setting it in cookies will also work
    // Make 1 API call to fetch info of every subject

    const res = await fetch('/api/student/results', {
        method: 'GET',
        credentials: 'include'
    });

    const results = await res.json();

    console.log(results);
}

INIT();