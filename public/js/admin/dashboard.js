async function INIT() {
    const $stdButtons = document.querySelectorAll('.std-btn');
    const $subButtons = document.querySelectorAll('.sub-btn');
    let $selectedStd = document.querySelector('.selected-std');
    let $selectedSub = document.querySelector('.selected-sub');
    const $resultsTable = document.querySelector('#resultstable');
    let flag = false;
    const $header = document.querySelector('.header');

    $stdButtons.forEach(btn => {
        btn.addEventListener('click', async function () {
            const newStd = this.getAttribute('data-value');
            const oldStdButton = document.querySelector('.selected-std');
            if (oldStdButton.getAttribute('data-value') !== newStd) {
                oldStdButton.classList.remove('selected-std');
                this.classList.add('selected-std');
                $selectedStd = this;
                await refresh({
                    std: newStd,
                    sub: $selectedSub.getAttribute('data-value')
                });
            }
        });
    });

    $subButtons.forEach(btn => {
        btn.addEventListener('click', async function () {
            const newSub = this.getAttribute('data-value');
            const oldSubButton = document.querySelector('.selected-sub');
            if (oldSubButton.getAttribute('data-value') !== newSub) {
                oldSubButton.classList.remove('selected-sub');
                this.classList.add('selected-sub');
                $selectedSub = this;
                await refresh({
                    std: $selectedStd.getAttribute('data-value'),
                    sub: newSub
                });
            }
        });
    });


    async function getResults(queryParams) {
        let query = [];
        for (let param in queryParams) {
            query.push(`${param}=${queryParams[param]}`);
        }
        query = query.join('&');
        if (query) query = '?' + query;

        const res = await fetch(`/api/results${query}`, {
            method: 'GET',
            credentials: 'include'
        });

        const { data: { user, results } } = await res.json();
        if (!flag) {
            $header.innerHTML = `<h1>Welcome, ${user.firstName}</h1>`;
            flag = true;
        }

        return results;
    }

    function renderTable(data) {
        if (data)
            $resultsTable.children[1].innerHTML = data.map(result => `
        <tr>
            <td>${result.studentId}</td>
            <td>${result.date}</td>
            <td>${result.marks}</td>
            <td>${result.total}</td>
        </tr>
        `).join('');
    }

    async function refresh(queryParams) {
        const results = await getResults(queryParams);
        renderTable(results);
    }

    await refresh({
        sub: $selectedSub.getAttribute('data-value'),
        std: $selectedStd.getAttribute('data-value')
    });
}

INIT();