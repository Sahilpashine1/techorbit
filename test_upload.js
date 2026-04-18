async function test() {
    try {
        console.log('Fetching...');
        const res = await fetch('http://localhost:3000/api/analyze-resume', { method: 'POST' });
        console.log('Status:', res.status);
        console.log('Text:', await res.text());
    } catch(e) {
        console.error('Crash:', e);
    }
}
test();
