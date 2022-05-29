import { Collapse, Checkbox } from 'antd'
import React, { useState }  from 'react'

const {Panel} = Collapse;

function CheckBox(props) {
    const [Checked, setChecked] = useState([])
    
    const renderCheckboxLists = () => props.list && props.list.map((value, index) => (
        <React.Fragment key={index}>
            <Checkbox 
            onChange={()=> handleToggle(value._id)} 
            checked={Checked.indexOf(value._id) === -1 ? false : true}
            />
            <span>{value.name}</span>
        </React.Fragment>
    ))

    const handleToggle = (value) => {
        const curIndex = Checked.indexOf(value)
        const checked = [...Checked]

        if(curIndex === -1) {
            // value가 없으면 넣어줌
            checked.push(value)
        }
        else {
            // 존재하면 이미 존재하는 값을 삭제
            checked.splice(curIndex, 1)
        }

        setChecked(checked)
        props.handleFilters(checked)
    }

    return (
        <div>
            <Collapse defaultActiveKey={['1']}>
                <Panel header="this is panel header1" key="1">
                    {renderCheckboxLists()}
                </Panel>
            </Collapse>
        </div>
    )
}

export default CheckBox