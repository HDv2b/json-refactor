/**
 * Created by Hussein on 10/02/2017.
 */
import React, {Component} from 'react';
import _ from "lodash";
import Breadcrumbs from "./components/Breadcrumbs";
import JsonBranch from './components/JsonBranch';
import Transformation from './components/Transformation';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
window.Perf = require('react-addons-perf');

class App extends Component {
    constructor() {
        super();
        this.state = {
            jsonInput: {},
            hoverTrail: [],
            activeTrail: [],
            transformations: []
        };
    }

    initJson(e) {
        try {
            this.setState({jsonInput: JSON.parse(e.target.value)});
        } catch (e) {
            console.log("invalid json");
        }
    }

    setHoverTrail(data) {
        this.setState({hoverTrail: data});
    };

    setActiveTrail(data) {
        this.setState({activeTrail: data});
    };

    selectTab(index, last){
        this.setState({
            selectedTab: index
        });
    };

    addTransformDelete(){
        let transformations = this.state.transformations;
        transformations.push({
            transformationType: "delete",
            trail: [...this.state.activeTrail]
        });
        this.setState({transformations});
    }

    addTransformRename(){
        let transformations = this.state.transformations;
        transformations.push({
            transformationType: "rename",
            trail: [...this.state.activeTrail],
            newName: this.state.renameKeyValue
        });
        this.setState({
            transformations,
            renameKeyValue: ""
        });
    }

    transformDelete(json,trail,depth = 0){

        // if end of trail, delete the key
        if(trail.length == depth + 1){
            if(typeof(json[trail[depth]]) !== "undefined") {
                delete json[trail[depth]];
            }
        } else {
            let branch = json[trail[depth]];
            let keyName = trail[depth];
            trail.shift();
            // if array, recurse function through all keys
            if (Array.isArray(branch)) {
                json[keyName] = branch.map(twig => {
                    return this.transformDelete(twig, [...trail], depth)
                });
            } else {
                // else recurse the function on the current
                if(typeof(json[keyName]) !== "undefined") {
                    json[keyName] = this.transformDelete(branch, [...trail], depth);
                }
            }
        }

        return json;
    }

    transformRename(json,trail,newName){
        console.log(json,trail,newName);

        const depth = 0;

        // if end of trail, rename the key by copying old key and deleting the original
        if(trail.length == depth + 1){
            if(typeof(json[trail[depth]]) !== "undefined") {
                json[newName] = json[trail[depth]];
                delete json[trail[depth]];
            }
        }else {
            let branch = json[trail[depth]];
            let keyName = trail[depth];
            trail.shift();
            // if array, recurse function through all keys
            if (Array.isArray(branch)) {
                json[keyName] = branch.map(twig => {
                    return this.transformDelete(twig, [...trail], depth)
                });
            } else {
                // else recurse the function on the current
                if(typeof(json[keyName]) !== "undefined") {
                    json[keyName] = this.transformDelete(branch, [...trail], depth);
                }
            }
        }

        return json;
    }

    processTransformations() {
        let json = _.cloneDeep(this.state.jsonInput);

        for(let transformation of this.state.transformations){
            switch(transformation.transformationType){
                case "delete":
                    json = this.transformDelete(json,[...transformation.trail]);
                    break;
                case "rename":
                    json = this.transformRename(json,[...transformation.trail],transformation.newName);
                    break;
            }
        }
        return json;
    }

    setRenameKeyValue(e) {
        this.setState({renameKeyValue: e.target.value});
    }

    render() {

        let transformations = this.state.transformations.map((transformation,key) => {
            return <Transformation key={key} transformation={transformation} />
        });

        return (
            <Tabs
                onSelect={this.selectTab.bind(this)}>
                <TabList>
                    <Tab className="tab-header">Input</Tab>
                    <Tab className="tab-header">Edit</Tab>
                    <Tab className="tab-header">Output</Tab>
                </TabList>

                <TabPanel>
                    <p>Enter raw JSON below, and then click "Edit" on the menu above. You can come back and edit this at any time.</p>
                    <textarea name="" id="input" cols="30" rows="10" onChange={this.initJson.bind(this)}/>
                </TabPanel>

                <TabPanel>
                    <Breadcrumbs className="ide-breadcrumbs"
                                 activeTrail={this.state.activeTrail}
                                 hoverTrail={this.state.hoverTrail}/>
                    <div id="json-parsed" className="ide-json">
                        <JsonBranch branch={this.processTransformations()}
                                    setHoverTrail={this.setHoverTrail.bind(this)}
                                    setActiveTrail={this.setActiveTrail.bind(this)}
                                    depth={0}
                                    hoverTrail={this.state.hoverTrail}
                                    trail={[]}
                        />
                    </div>
                    <div className="ide-transformations">
                        <h1>Tools</h1>
                        <input ref={(input) => {this.renameKeyInput = input;}} onChange={this.setRenameKeyValue.bind(this)} placeholder={this.state.activeTrail[this.state.activeTrail.length -1]} /><button onClick={this.addTransformRename.bind(this)}>Rename Key</button><br />
                        <button onClick={this.addTransformDelete.bind(this)}>Delete Key</button>
                        <h1>Transformations</h1>
                        <ul>
                            {transformations}
                        </ul>
                    </div>
                </TabPanel>

                <TabPanel>
                    <textarea name="" id="output" cols="30" rows="10"/>
                </TabPanel>
            </Tabs>
        );
    }
}

export default App;
