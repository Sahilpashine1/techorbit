const q = async () => {
   const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyBK3SsrAtNrT9_AwSnjT-y-nW6_Yy3iyP8", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: "hello" }] }] })
   });
   console.log(res.status, await res.text());
}; q();
