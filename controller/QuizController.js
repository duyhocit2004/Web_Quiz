import {getAllQuiz} from "../Api/Api.js";
const app = {
      //  hiển thị các câu hỏi
    renderListQuiz : async function(){
      //1. lấy danh sách các câu hỏi
      const data = await getAllQuiz();
    //   console.log(data);

      //đổ dữ liệu ra danh sách
       const listQuiz = data?.map((item,index)=>{
            //1.1 đổ dữ liệu cách 2
            // return `
            // <a href="#" class="list-group-item list-group-item-action list-group-item-primary">
            //     ${item.title}: ${item.description}
            // </a>
            // `

            // 1.2 đổ dữ liệu cách 2
            if(item.isActive){
                return `
            <a href="#" data-id=${item.id} class="Quiz-item list-group-item list-group-item-action list-group-item-primary">
                ${item.title}: ${item.description}
            </a>`
            }

        }).join("");//lấy 1 mảng thành 1 chuỗi

        //2.1 lấy Element (#list_quiz)
        console.log(listQuiz);
        const listQuizEle = document.getElementById('list_quiz');
        //2.2 đổ element thông qua innerHTML
        listQuizEle.innerHTML = listQuiz
        this.handeleClickQuiz();
    },
    handeleClickQuiz : function(){
        // 1 . lấy danh sách (mảng) các quiz
        const list = document.querySelectorAll('.Quiz-item');
        console.log(list);
        // 2 .khai báo sự kiện
        list.forEach((item)=>{
            item.addEventListener('click',()=>{
                //3 . xác nhận 
                const event = item.textContent;
                if(window.confirm('bạn có chắc chắn làm khồn')){
                    // console.log('làm');

                    // lấy id :
                    //c1 :
                    // const id = item.dataset.id;
                    // console.log(id);

                    //c2 :
                    const id1 = item.getAttribute("data-id");
                    console.log(id1);

                    // 4 .chuyển trang
                    window.location = `question.html?id=${id1}`      
                    
                }
                // console.log(123);
            });
        });
    },
    start : function (){
            //hiển thị danh sách các câu hỏi
            // 1 . lấy danh sách các câu hỏi
            //render : hiển thị giao diện
            // handle : thực thi Logic

            this.renderListQuiz();
    },
  
        
       
}
app.start();