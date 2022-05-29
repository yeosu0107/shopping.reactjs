import React, { useState } from 'react'
import {Input} from 'antd'

const {Search} = Input;

function SearchBox(props) {
    
    const [SearchTerm, setSearchTerm] = useState("")


    const searchHandler = (event) => {
        setSearchTerm(event.currentTarget.value)
        props.updateSearchTerm(event.currentTarget.value)
    }

    return (
        <div>
            <Search 
                placeholder="search"
                onChange={searchHandler}
                style={{width:200}}
                value={SearchTerm}
            />
        </div>
    )
}

export default SearchBox
