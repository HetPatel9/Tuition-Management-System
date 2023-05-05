async function INIT() {
    const $deleteForm = document.querySelector('.delete-form');
    const $textareabox = document.querySelector('#textareabox');
    const $checkbox = document.querySelector('#rec-dlt');

    $checkbox.addEventListener('change', (e) => {
        $textareabox.style.display = e.target.checked ? 'block' : 'none';
    });


    $deleteForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        let body = {};
        let url = '';

        if ($checkbox.checked) {
            body = {
                test: {
                    date: e.target.elements.date.value,
                    std: e.target.elements.std.value,
                    subject: e.target.elements.subject.value
                },
                students: e.target.elements.students.value.split(',')
            };

            url = '/api/results/delete';
        } else {
            body = {
                date: e.target.elements.date.value,
                std: e.target.elements.std.value,
                subject: e.target.elements.subject.value
            };

            url = '/api/test/delete';
        }

        const res = await fetch(url, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (res.ok) location.replace('/dashboard');
    });
}

INIT();