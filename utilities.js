function set_box_to_picked(id,db){

    picked = 1
    
    update_query = "UPDATE boxes SET picked = picked +1  WHERE id = ?"

    db.run(update_query,[picked,id],function(err){
        if(err){
            throw err
        }
        else{
            
            console.log(`update ${id} to 'picked'.`)
        }
    })
}

exports.set_box_to_picked = set_box_to_picked


function randomly_select_box(retrieved_data){
    const selected_target_idx = Math.floor(Math.random() * retrieved_data.length) 
    const selected_lucky_box = retrieved_data[selected_target_idx]
    return selected_lucky_box
}
exports.randomly_select_box = randomly_select_box
