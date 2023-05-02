async function INIT() {
    const $testFormBlock = document.querySelector('.form-box');
    const $resultsFormBlock = document.querySelector('.student-update-marks');
    const resultsBody = { results: [] };

    const $testForm = document.querySelector('#update-form');
    $testForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const body = {
            date: e.target.elements.date.value,
            std: e.target.elements.std.value,
            subject: e.target.elements.subject.value
        };

        const res = await fetch('/api/test', {
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

    const checkBox = document.querySelector('#absent');
    const marksInput = document.querySelector('.student-data:nth-child(2)');

    checkBox.addEventListener('change', (e) => {
        marksInput.style.display = e.target.checked ? 'none' : 'block';
    });

    const $resultsForm = document.querySelector('#data-form');
    const $completeButton = document.querySelector('.complete-btn');

    $resultsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const result = {
            enrolNo: e.target.elements.enrolNo.value,
            status: e.target.elements.absent.checked ? 0 : 1
        };

        result.status && (result.marks = e.target.elements.marks.value);

        resultsBody.results.push(result);
        e.target.reset();
    });

    $completeButton.addEventListener('click', async (e) => {
        e.preventDefault();

        const res = await fetch('/api/results/update', {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(resultsBody)
        });

        if (res.ok)
            location.replace('/dashboard');
    }
    );
}

INIT();