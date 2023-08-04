import React, {useState} from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function RegisterForm() {
  const navigate = useNavigate()

  const [lessonThumbnailUrl, setLessonThumbnailUrl] = useState('')
  const [ThumbnailFile, setThumbnailFile] = useState(null)
  const accessToken = useSelector((state) => state.auth.access_token)
  const lessonTitle = useSelector((state) => state.lesson.lessonTitle)
  const categoryId = useSelector((state) =>  parseInt(state.lesson.categoryId))+1
  const maximum = useSelector((state) => parseInt(state.lesson.maximum))
  const price = useSelector((state) => parseInt(state.lesson.price))
  const lessonDate = useSelector((state) => state.lesson.lessonDate).slice(0,-5)
  const difficulty = useSelector((state) => state.lesson.difficulty)
  const timeTaken = useSelector((state) => parseInt(state.lesson.timeTaken))
  const description = useSelector((state) => state.lesson.description)
  const materials = useSelector((state) => state.lesson.materials)
  const videoUrl = useSelector((state) => state.lesson.videoUrl)
  const lessonStepList = useSelector((state) => state.lesson.lessonStepList)

  const categoryValid = useSelector((state) => state.lesson.categoryValid)
  const titleValid = useSelector((state) => state.lesson.titleValid)
  const maxValid = useSelector((state) => state.lesson.maxValid)
  const priceValid = useSelector((state) => state.lesson.priceValid)
  const dateValid = useSelector((state) => state.lesson.dateValid)
  const difficultyValid = useSelector((state) => state.lesson.difficultyValid)
  const timeTakenValid = useSelector((state) => state.lesson.timeTakenValid)
  const materialsValid = useSelector((state) => state.lesson.materialsValid)
  const stepValid = useSelector((state) => state.lesson.stepValid)
  const descriptionValid = useSelector((state) => state.lesson.descriptionValid)
  const [thumbnailValid, setThumbnailValid] = useState(false);
  const isAllValid = [categoryValid, titleValid, maxValid, priceValid, dateValid, difficultyValid, timeTakenValid, materialsValid, stepValid, descriptionValid, thumbnailValid].every((isValid) => isValid);


  const handleThumbnailUrl = (e) => {
    setLessonThumbnailUrl(e.target.value) // 파일명 유저들에게 보여주기
    const file = e.target.files[0]
    setThumbnailFile(file)
    setThumbnailValid(!!file)
  };

  const register = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('thumbnailUrl', ThumbnailFile);
    formData.append('lessonTitle', lessonTitle);
    formData.append('categoryId', categoryId);
    formData.append('maximum', maximum);
    formData.append('price', price);
    formData.append('lessonDate', lessonDate);
    formData.append('difficulty', difficulty);
    formData.append('timeTaken', timeTaken);
    formData.append('description', description);
    formData.append('videoUrl', videoUrl);
      materials.forEach((material) => {
        formData.append('materials', material);
    });
    
    lessonStepList.forEach((step, index) => {
      formData.append(`lessonStepList[${index}].stepOrder`, step.stepOrder);
      formData.append(`lessonStepList[${index}].stepContent`, step.stepContent);
    });
  
  axios
    .post(`api/v1/lesson`, formData, {
      headers: {
        Access_Token : accessToken,
        'Content-Type': 'multipart/form-data'
      },
    })
    .then((res) => {
      console.log(res);
      alert('과외 생성에 성공했습니다!')
      navigate('/totallessons')
    })
    .catch((err) => {
      console.log(err);
    });
  };
  
  return (
    <div>
      {/* 썸네일 */}
      <div>
        <h3>과외 썸네일</h3>
        <div>{thumbnailValid ? '✅' : '🔲'}</div>
        <div>
          <input type="file"
            name = "filename"
            value={lessonThumbnailUrl}
            onChange={handleThumbnailUrl}
          />
        </div>
      </div>
    <button disabled={!isAllValid} onClick={register} >과외 등록하기</button>
  </div>
  );
}

export default RegisterForm;
