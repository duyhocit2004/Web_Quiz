import {getQuizById} from "../Api/Api.js";
import{getQuestionsByIdQuiz} from "../Api/Api.js";
var listQuestion=[];
var listAnswerSubmit =[];
 const app ={
    
    getQuizAndQuestion : async function(){
        //lấy id trên url `http://localhost:3000/quizs/$acb`
        const searchParam = new URLSearchParams(window.location.search)

        if(searchParam.has('id')){
            const id = searchParam.get('id');
           
            //lấy dữ quiz theo id của Quiz
            const dataquiz = await getQuizById(id);
            console.log(dataquiz);
            // hiển thị thông tin giao diện
            this.renderQuizInfo(dataquiz);

            //thông tin question
            // console.log(id);
            listQuestion = await getQuestionsByIdQuiz(id)
            console.log(listQuestion);

            this.renderListQuestion(listQuestion);

         
        }
    },
    renderQuizInfo : function (data){
        document.getElementById('quiz_heading').innerHTML = data.title;
        document.getElementById('quiz_description').innerHTML = data.description;
    },
    renderListQuestion : function(list){

        list = this.random(list);
        // 2. duyệt qua mảng câu hỏi
        const questionItem = list?.map((item,index)=>{
            
            const listAnswers = this.renderAnswers(item.answers,item.type,item.id);
            
            // 3. Thay đổi nội dung câu hỏi
            return `
                <div class="question_item border border-2 rounded p-4 mb-2">
                    <h4 class="question_number" id="${item.id}">Câu hỏi: ${index+1}</h4>
                    <h5 class="question_title" >
                       ${item.questionTiltle}
                    </h5>
                    <div class="answer_items mt-3">
                       ${listAnswers}
                    </div>
                </div>
            `
        }).join("");

        document.getElementById('question_container').innerHTML = questionItem
    },
    random : function(array){
        return array.sort(()=>{ return Math.random() - Math.random()} );
    },
    renderAnswers:function(listAnswers,type,idQuestion){
        //listAnswers: danh sách câu trả lời
        // type: kiểu câu hỏi 1: radio, 2: checkbox
        //idQuestion: id của câu hỏi

        // 1. tráo câu trả lời
        listAnswers= this.random(listAnswers);
        // 2. duyệt qua mảng câu trả lời
        return listAnswers?.map((ans,index)=>{
            return `
                <div class="form-check fs-5 mb-3">
                    <input class="form-check-input border border-2 border-primary" role="button" 
                        type="${type == 1 ? 'radio': 'checkbox'}" 
                        name="question_${idQuestion}" 
                        id="answer_${idQuestion}_${ans.id}"
                        data-idquestion="${idQuestion}"
                        data-idanswer="${ans.id}" >

                    <label class="form-check-label" role="button" for="answer_${idQuestion}_${ans.id}" >
                        ${ans.answerTitle}
                    </label>
                </div>
            `
        }).join("")
    },

    handleSubmit:function(){
        const BtnSubmit = document.getElementById('btn_submit');
            BtnSubmit.addEventListener('click',()=>{
                if(window.confirm('ban co chac chan nop bai khong'));
                    const inputAll = document.querySelectorAll('input');
                    // console.log(inputAll);
                        inputAll.forEach((item)=>{
                            item.addEventListener('click',(e)=>{
                                e.preventDefault();
                    })
                })
            // I. Lấy đáp án mà người lựa chọn
        // 1. lấy tất cả câu trả lời theo từng câu hỏi
        const listAnswersUser = document.querySelectorAll('.answer_items');
        // 2. duyệt qua từng nhóm câu trả lời
        
        listAnswersUser?.forEach((answers)=>{
            // console.log({answers});
            const data ={
                idQuestion: '',
                idAnswers: []
            }
            const inputs = answers.querySelectorAll('input');

            //3. duyệt mảng các câu trả lời
            inputs?.forEach((ans)=>{
                if(ans.checked){
                    data.idQuestion = ans.dataset.idquestion;
                    data.idAnswers.push(ans.dataset.idanswer)
                }
            })
            // console.log(inputs)

            if(data.idAnswers && data.idAnswers.length)
                listAnswerSubmit.push(data)
        })
        // Kiểm tra đáp xem có chính xác không
        this.checkAnswers(listAnswerSubmit)
            
        });
    },
    checkAnswers:function(listAnswerSubmit){
        // 1. Lưu trữ kết quả kiểm tra
        const checkResult=[];
        // console.log(listAnswerSubmit);
        console.log(listQuestion); // danh sách câu hỏi từ getQuizandQuestion
        
        // 2. duyệt qua các đáp án mà người dùng lựa chọn
        const listStatus = [];
        let countRight =0;

        listAnswerSubmit.forEach((ansUser)=>{

            // 2.1 tìm câu hỏi có đáp án trong mảng listQuestion(lấy từ db)
            const findQuestion = listQuestion.find((ques)=> {return ques.id == ansUser.idQuestion})
            console.log(findQuestion);
            // 2.2 so sánh giá trị của 2 mảng
            //  ansUser.idAnswers: danh sách đáp của user (mảng)
            // findQuestion.correctAnser: đáp án chính xác lấy từ db (mảng)
            const isCheck = this.checkEqual(ansUser.idAnswers,findQuestion.correctAnser);
            // 2.3 Lưu trữ trạng thái đúng/sai của câu hỏi

            if(isCheck){
                // nếu đúng tăng count lên 1
                countRight++
            }
            // lưu trữ trạng thái đúng hoặc sai của câu hỏi đã trả lời
            listStatus.push({
                idQuestion: findQuestion.id,
                status: isCheck
            })
        })
        // hiên thị trạng thaid đúng hoặc sai của câu hỏi đã trả lời
        this.renderStatus(listStatus);
        // thông báo
        alert(`Ban tra loi dung ${countRight}/${listQuestion.length}`)
        console.log(listStatus);
        

    },
    checkEqual : function(arr1,arr2){
        if(arr1.length != arr2.length){
            return false
        }

        arr1 =arr1.sort();
        arr2 =arr2.sort();

        for(var i = 0 ;1 <arr1.length;i++){
            if(arr1[i] != arr2[i]){
                return false
            }
        }
        return true
        
    },
    renderStatus : function(liststatus){
        liststatus.forEach((item)=>{
              const title = document.getElementById(item.idQuestion);
              console.log(title);
                title.innerHTML = `${title.textContent} ${item.status ? `<span class="badge text-bg-success">Đúng</span>`: `<span class="badge text-bg-danger">Sai</span>`}`
        });
    },
    start : function(){ 
        this.getQuizAndQuestion();
        this.handleSubmit();
        this.renderQuizInfo();          
    }
 }
 app.start();