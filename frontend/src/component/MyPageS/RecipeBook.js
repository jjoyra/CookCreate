import React, {useState, useEffect} from "react";
import "../../style/recipebook.css";
import SideBar from "./SideBar";
import axios from "axios";
import { useSelector } from "react-redux";
import RecipeBookModal from "./RecipeBookModal";

function RecipeBook() {
  const accessToken = useSelector((state) => state.auth.access_token);
  // console.log(accessToken);
  const [ recipeBookData, setRecipeBookData ] = useState(null);
  const [ showRecipe, setShowRecipe ] = useState(false)

  useEffect(() => {
    axios
      .get(`api/v1/my/recipe`, {
        headers: {
          Access_Token: accessToken,
        },
      })
      .then((res) => {
        console.log("레시피북", res.data[0].message === "신청한 과외가 없습니다.");
        if (res.data[0].message !== "신청한 과외가 없습니다.") {
          setRecipeBookData(res.data);
        } else {
          setRecipeBookData(null)
        }
      })
      .catch((err) => {
        console.log("레시피북 정보 못가져옴", err);
      });
  }, []);

  const handleShowRecipe = ( data ) => {
    setShowRecipe(data)
  }

  return (
    <div className="recipe_container">
      <SideBar />
      <h1>레시피북</h1>
      {recipeBookData !== null ? (
        recipeBookData.map((recipe) => (
          <div key={recipe.lessonId}>
            <div className="recipe_content">
              <div className="recipe_view">
                <div className="recipe_crop">
                  <img className="recipe-img" src={recipe.thumbnailUrl} alt="레시피 미리보기 사진"></img>
                </div>
                <ul>
                  <div className="recipe">
                    {/* <a href="" className="recipe"> */}
                    {/* <span className="recipe"><img src="https://recipe1.ezmember.co.kr/cache/rpf/2016/01/29/900013400086b533aef0411aeb3ee7d71.png"></span> */}
                    {/* <img src="https://recipe1.ezmember.co.kr/cache/recipe/2019/08/21/f51404dc513ccc76be4b5668f5dd350b1_m.jpg" /> */}
                    {/* </a> */}
                  </div>
                  <div>
                    <div>강좌명: {recipe.lessonTitle}</div>
                  </div>
                  <div>
                    <p>
                      카테고리: 
                      {(() => {
                        switch (recipe.categoryId) {
                          case 0:
                            return "한식";
                          case 1:
                            return "양식";
                          case 2:
                            return "중식";
                          case 3:
                            return "일식";
                          case 4:
                            return "아시안";
                          case 5:
                            return "건강식";
                          case 6:
                            return "디저트";
                          default:
                            return "알 수 없음";
                        }
                      })()}
                    </p>
                  </div>
                  <div>
                    <div>선생님: {recipe.cookyerName}</div>
                  </div>
                  <div>
                    {/* <div>과외 날짜:{recipe.lessonDate}</div> */}
                    <div>과외 날짜: {new Date(recipe.lessonDate).toISOString().split("T")[0]}</div>
                  </div>
                  <div>
                    <button onClick={() => handleShowRecipe(true)}>레시피 보기</button>
                    {/* <div>진행단계</div>
                    <div>{recipe.lessonStepList}</div> */}
                  </div>
                </ul>
              </div>
            </div>
            {showRecipe ? (
              <RecipeBookModal
                lessonStepList={recipe.lessonStepList}
                handleShowRecipe={handleShowRecipe}
              />
            ) : null}
          </div>
        ))
      ) : (
        <p>레시피북이 없습니다.</p>
      )}
    </div>
  );
}

export default RecipeBook;
