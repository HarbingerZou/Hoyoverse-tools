import Avatar_config from "../../../models/starRailConfig/avatarConfigModel";

export default async function(req, res){
    const { 
		characterDamage,
		...inputConfigs
	} = req.body;
	
	console.log(inputConfigs)

	let avartarConfig = await Avatar_config.findById(characterDamage)
	
	if(!avartarConfig){
		res.status(500).json({message: "Failed to save data", error: err.message});
	}

	const processRatios = (index, maxLevel) => {
		const stats_name = inputConfigs[`${index}_name`] || undefined
		if(!stats_name){
			return undefined
		}
		const type = inputConfigs[`${index}_type`] || undefined
		if(!type){
			return
		}

		const ratios = [];
		const stats = []
		for (let level = 1; level <= maxLevel; level++) {
			const level_stats = {}
			if(inputConfigs[`${index}_${level}_damage`]){
				level_stats.damage_ratio = inputConfigs[`${index}_${level}_damage`]
			}
		  	if(inputConfigs[`${index}_${level}_coef_category`]){
				const multiplier = {category: inputConfigs[`${index}_${level}_coef_category`], value: inputConfigs[`${index}_${level}_coef_value`]}
				level_stats.multipliers = []
				level_stats.multipliers.push(multiplier)
			}else{
				
			}
			stats.push(level_stats)
		}
		console.log(stats)

		const target_count = inputConfigs[`${index}_count`] || 1

		
		return { name: stats_name, type, ratios, target_count, stats};
	}
	avartarConfig.damages = []
	const temp1 = processRatios(0, 7) 
	temp1 && avartarConfig.damages.push(temp1)
	const temp2 = processRatios(1, 12) 
	temp2 && avartarConfig.damages.push(temp2)
	const temp3 = processRatios(2, 12) 
	temp3 && avartarConfig.damages.push(temp3)

	try {
        await avartarConfig.save();
        res.status(200).json({message: "Success"});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Failed to save data", error: err.message});
    }
}