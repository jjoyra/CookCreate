import React from 'react';

function IntroduceLesson({difficulty, description, materials}) {
  return (
    <div>
      <h2>강의 소개</h2>
      <div>
        <h3>난이도</h3>
        {difficulty}
      </div>
      <div>
        <h3>강의 설명</h3>
        {description}
      </div>
      <div>
        <h3>준비물</h3>
        {materials}
      </div>
    </div>
  );
}

export default IntroduceLesson;