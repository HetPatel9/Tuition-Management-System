async function INIT() {
    const $header = document.querySelector('.header');

    const res = await fetch('/api/student/results', {
        method: 'GET',
        headers: {
            'Accept':'application/json'
        },
        credentials: 'include'
    });

    const { data: { name, results } } = await res.json();
    console.log(results);

    $header.innerHTML = `<h1>Welcome, ${name.firstName}</h1>`;
    let tables = document.querySelectorAll('.resultstable');

    tables.forEach(table => {
        const key = table.getAttribute('id').toUpperCase();
        const tbody = table.children[1];
        if (!results[key]?.length) {
            tbody.innerHTML = `
            <tr>
                <td colspan="3">No Results found</td>
            </tr>
            `;
        } else {
            let temp = '';
            results[key].forEach(result => {
                temp += `
                <tr>    
                    <td>${result.date}</td>
                    <td>${result.total}</td>
                    <td>${result.status === 'PRESENT' ? result.marks : result.status}</td>
                </tr>
                `;
            });

            tbody.innerHTML = temp;
        }
    });

    // for (let sub in results) {
    //     // table = document.querySelector(`#${sub.toLowerCase()}`);
    // }

}

INIT();