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

        const res = await fetch('/api/test/add', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
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
        const enrolNo = parseInt(e.target.elements.enrolNo.value)
        const marks  = parseFloat(e.target.elements.marks.value)
        
        if(marks > resultsBody.test.total){
            return alert('Marks cannot be more than the Total marks of Test')
        }

        resultsBody.results[enrolNo] = marks;
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