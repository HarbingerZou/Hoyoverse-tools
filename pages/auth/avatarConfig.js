import handleSubmit from "../../../utils/handleSubmit";
import { useState } from "react";
import Avatar_config from "../../../models/starRailConfig/avatarConfigModel";
import useRacingCheckWrapper from "../../../utils/racingCheck";
import { MultiplierCategorySelect } from "../../../components/star_rail_config/Select";

export default function AddCharacterDamage({avatars}) {
	const [selectedInstance, setselectedInstance] = useState(avatars[0]);
	const protectedHandleSubmit = useRacingCheckWrapper(handleSubmit)
	return(
    <div className = "body">
      <form onSubmit={(evt)=>protectedHandleSubmit({evt:evt,path:"starrail-config/avatarConfig", redirect:true},)}>
        <h2>Character Config</h2>
        <div className = "vertical_input_form">
          <select className="large_input_field" name="characterDamage" value={selectedInstance._id}
            onChange={(evt) => setselectedInstance(avatars.find(avatar => avatar._id === evt.target.value))}>
            {avatars.map(avatar=>
              <option value={avatar._id}>{avatar.name}</option>
            )}
          </select>
        
          <SkillInputist index={0} maxLevel={7} character={selectedInstance}/>
          <SkillInputist index={1} maxLevel={12} character={selectedInstance}/>
          <SkillInputist index={2} maxLevel={12} character={selectedInstance}/>

          <input type="submit" value="Add" className = "large_input_field" />		
        </div>
      </form>
    </div>
    )
}
function SkillInputist({index, maxLevel, character}){
    const list = []
    for(let level = 1;level<=maxLevel;level++){
        const instance = 
          <div>
            <input type="number" step="0.01" name={`${index}_${level}_damage`} className = "large_input_field" placeholder = {`level ${level}`} defaultValue={character.damages&&character.damages[index]?character.damages[index].stats[level-1].damage_ratio:""}/>
            <MultiplierCategorySelect name={`${index}_${level}_coef_category`} category={character.damages&&character.damages[index]?character.damages[index].stats[level-1].multiplier?.category:""}/>
            <input type="number" name={`${index}_${level}_coef_value`} className="large_input_field" placeholder="boost value" defaultValue={character.damages&&character.damages[index]?character.damages[index].stats[level-1].multiplier?.value:""}/> 
          </div>

          list.push(instance)
    }
    return (
        <div>
            <h3>Damage list {index}</h3>
            <input type="text" name={`${index}_name`} className="large_input_field" placeholder="damage name" defaultValue={character.damages&&character.damages[index]?character.damages[index].name:""}/>
            <input type="text" name={`${index}_type`} className="large_input_field" placeholder="damage type: ATK, DEF, or HP" defaultValue={character.damages&&character.damages[index]?character.damages[index].type:""}/>
            <div className="row_flex">
                {list}
            </div>
            <input type="number" name={`${index}_count`} className="large_input_field" placeholder="enemy count" defaultValue={character.damages&&character.damages[index]?character.damages[index].count:1}/> 
        </div>
    )
}



export async function getServerSideProps(){
    try {
      const preAvatars = await Avatar_config.find({}).sort({name:1});
      let avatars = JSON.parse(JSON.stringify(preAvatars));
      return {
        props: {
			    avatars: avatars,
        },
      };
    } catch (error) {
      console.log(error);
      return {
        notFound: true,
      };
    }
};
