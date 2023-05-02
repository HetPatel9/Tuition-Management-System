async function INIT() {
    const $testFormBlock = document.querySelector('#exam-detail');
    const $resultsFormBlock = document.querySelector('#marks-form');
    const resultsBody = { results: {} };

    const $testForm = document.querySelector('.exam-form');
    $testForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const body = {
            date: e.target.elements.date.value,
            std: e.target.elements.std.value,
            subject: e.target.elements.subject.value,
            total: e.target.elements.total.value
        };

        console.log(body);

        const res = await fetch('/api/test/add', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (res.ok) {
            const { data } = await res.json();

            resultsBody.test = data;
            $testFormBlock.style.display = 'none';
            $resultsFormBlock.style.display = 'block';
        }
    });

    const $resultsForm = document.querySelector('.student-marks-form');
    const $completeButton = document.querySelector('#complete-btn');

    $resultsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log(resultsBody);
        resultsBody.results[e.target.elements.enrolNo.value] = e.target.elements.marks.value;
        e.target.reset();
    });

    $completeButton.addEventListener('click', async () => {
        const res = await fetch('/api/results/add', {
            method: 'POST',
            credentials: 'include',
            redirect: 'follow',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(resultsBody)
        });

        if (res.ok)
            location.replace('/dashboard');
    });
}

INIT();