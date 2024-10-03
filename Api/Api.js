export const getAllQuiz = async () => {
    try {
        // call api lây danh sách quiz
    const res = await fetch('http://localhost:3000/quizs');//call api : gọi bất đồng bộ
    // const data = await 
    const data = await res.json();
    // console.log(data); // đồng bộ
    return data;
    } catch (error) {
            alert('lỗi');
    }
    

}
