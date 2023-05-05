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
            enrolNo: parseInt(e.target.elements.enrolNo.value),
            status: e.target.elements.absent.checked ? 0 : 1
        };
        const marks = parseFloat(e.target.elements.marks.value)

        if (result.status) {
            if (marks > parseInt(resultsBody.test.total))
                return alert('Marks cannot be more than the Total marks of Test')

            result.marks = marks;
        }

        resultsBody.results.push(result);
        console.log(resultsBody);
        e.target.reset();
        marksInput.style.display = 'block'
    });

    $completeButton.addEventListener('click', async (e) => {
        e.preventDefault();
        try {

            const res = await fetch('/api/results/update', {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(resultsBody)
            });

            if (res.ok)
                location.replace('/dashboard');
            const data = await res.json();
            if (res.status !== 200) {
                throw new Error(data.message)
            }

        } catch (err) {
            alert(err.message);
            location.reload()
        }
    }
    );
}

INIT();