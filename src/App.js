/**
 * Created by Hussein on 10/02/2017.
 */
import React, { Component } from 'react';
import _ from 'lodash';
import {
  Tab, Tabs, TabList, TabPanel,
} from 'react-tabs';
import Breadcrumbs from './components/Breadcrumbs';
import JsonBranch from './components/JsonBranch';
import Transformation from './components/Transformation';
// window.Perf = require('react-addons-perf');

class App extends Component {
  constructor() {
    super();
    this.state = {
      jsonInput: {},
      hoverTrail: [],
      activeTrail: [],
      transformations: [],
    };
  }

  initJson(e) {
    try {
      this.setState({ jsonInput: JSON.parse(e.target.value) });
    } catch (e) {
      console.log('invalid json');
    }
  }

  setHoverTrail(data) {
    this.setState({ hoverTrail: data });
  }

  setActiveTrail(data) {
    this.setState({ activeTrail: data });
  }

  selectTab(index, last) {
    this.setState({
      selectedTab: index,
    });
  }

  addTransformDelete() {
    const transformations = this.state.transformations;
    transformations.push({
      isActive: true,
      transformationType: 'delete',
      trail: [...this.state.activeTrail],
    });
    this.setState({ transformations });

    // update breadcrumbs to select parent of deleted object
    const newActiveTrail = [...this.state.activeTrail];
    newActiveTrail.splice(-1, 1);
    this.setActiveTrail(newActiveTrail);
  }

  addTransformRename() {
    const transformations = this.state.transformations;
    const newName = this.state.renameKeyValue;
    transformations.push({
      isActive: true,
      transformationType: 'rename',
      trail: [...this.state.activeTrail],
      newName,
    });
    this.setState({ transformations });

    // update breadcrumbs to match new name
    const newActiveTrail = [...this.state.activeTrail];
    newActiveTrail.splice(-1, 1, newName);
    this.setActiveTrail(newActiveTrail);
  }

  addTransformHashify() {
    const transformations = this.state.transformations;
    transformations.push({
      isActive: true,
      transformationType: 'hashify',
      trail: [...this.state.activeTrail],
    });
    this.setState({ transformations });
  }

  transformDelete(json, trail, depth = 0) {
    // if end of trail, delete the key
    if (trail.length == depth + 1) {
      if (typeof (json[trail[depth]]) !== 'undefined') {
        delete json[trail[depth]];
      }
    } else {
      const branch = json[trail[depth]];
      const keyName = trail[depth];
      trail.shift();
      // if array, recurse function through all keys
      if (Array.isArray(branch)) {
        json[keyName] = branch.map(arrayItem => this.transformDelete(arrayItem, [...trail], depth));
      } else {
        // else recurse the function on the current
        if (typeof (json[keyName]) !== 'undefined') {
          json[keyName] = this.transformDelete(branch, [...trail], depth);
        }
      }
    }

    return json;
  }

  transformRename(json, trail, newName) {
    const newJson = {};
    // foreach in order to try to preserve key order
    _.forEach(json, (value, key, branch) => {
      if (trail[0] === key) {
        // if key matches first element in trail
        if (trail.length === 1) {
          // if it's the last element in the trail, then this is the key to change
          newJson[newName] = json[key];
        } else {
          // or else iterate up the trail
          trail.shift();
          if (Array.isArray(json[key])) {
            // if element is an array, iterate through each element
            newJson[key] = json[key].map(arrayItem => this.transformRename(arrayItem, [...trail], newName));
          } else {
            // else EZ-PZ
            newJson[key] = this.transformRename(json[key], [...trail], newName);
          }
        }
      } else {
        // preserve the branch;
        newJson[key] = json[key];
      }
    });

    return newJson;
  }

  transformHashify(json, trail) {
    let newJson = {};
    if (Array.isArray(json)) {
      if (trail.length === 1) {
        const objectIdKeyName = trail[trail.length - 1];
        _.forEach(json, (value, key, branch) => {
          // for each item in the array, make a new json key with the value being that object
          const objectId = value[objectIdKeyName];
          newJson[objectId] = value;
          delete newJson[objectId][objectIdKeyName];
        });
      } else {
        // still need to go deeper...
        newJson = [...json].map(arrayItem => this.transformHashify(arrayItem, [...trail]));
      }
    } else {
      _.forEach(json, (value, key, branch) => {
        // for each property in the object
        const newTrail = [...trail];
        if (newTrail[0] === key) {
          newTrail.shift();
          // if key matches first element in trail
          newJson[key] = this.transformHashify(json[key], [...newTrail]);
        } else {
          // preserve the branch;
          newJson[key] = json[key];
        }
      });
    }

    return newJson;
  }

  processTransformations() {
    let json = _.cloneDeep(this.state.jsonInput);

    for (const transformation of this.state.transformations) {
      if (transformation.isActive) {
        switch (transformation.transformationType) {
          case 'delete':
            json = this.transformDelete(json, [...transformation.trail]);
            break;
          case 'rename':
            json = this.transformRename(json, [...transformation.trail], transformation.newName);
            break;
          case 'hashify':
            json = this.transformHashify(json, [...transformation.trail]);
            break;
        }
      }
    }
    return json;
  }

  setRenameKeyValue(e) {
    this.setState({ renameKeyValue: e.target.value });
  }

  handleRenameClick(e) {
    this.addTransformRename();
    // this.setState({renameKeyValue:""});
    console.log(e.target.value);
    // e.target.value = "";
  }

  toggleTransformActive(key) {
    const transformations = [...this.state.transformations];
    transformations[key].isActive = !transformations[key].isActive;
    this.setState({ transformations });
  }

  deleteTransform(key) {
    const transformations = [...this.state.transformations];
    transformations.splice(key, 1);
    this.setState({ transformations });
  }

  render() {
    const transformations = this.state.transformations.map((transformation, key) => <Transformation key={key} transformation={transformation} deleteTransform={() => this.deleteTransform(key)} toggleTransform={() => this.toggleTransformActive(key)} />);

    return (
      <Tabs
        onSelect={this.selectTab.bind(this)}
      >
        <TabList>
          <Tab className="tab-header">Input</Tab>
          <Tab className="tab-header">Edit</Tab>
          <Tab className="tab-header">Output</Tab>
          <Tab className="tab-header">About</Tab>
        </TabList>

        <TabPanel>
          <p>
Enter raw JSON below, and then click "Edit" on the menu above. You can come back and edit this at
                        any time.
          </p>
          <textarea name="" id="input" cols="30" rows="10" onChange={this.initJson.bind(this)} />
        </TabPanel>

        <TabPanel className="tab-ide">
          <Breadcrumbs
            className="ide-breadcrumbs"
            activeTrail={this.state.activeTrail}
            hoverTrail={this.state.hoverTrail}
          />
          <div id="json-parsed" className="ide-json">
            <div className="ide-json-gutter" />
            <JsonBranch
              branch={this.processTransformations()}
              setHoverTrail={this.setHoverTrail.bind(this)}
              setActiveTrail={this.setActiveTrail.bind(this)}
              depth={0}
              hoverTrail={this.state.hoverTrail}
              trail={[]}
            />
          </div>
          <div className="ide-transformations">
            <h1>Tools</h1>
            <span className="transform-field">
              <input
                ref={(input) => {
                  this.renameKeyInput = input;
                }}
                onChange={this.setRenameKeyValue.bind(this)}
                placeholder={this.state.activeTrail[this.state.activeTrail.length - 1]}
              />
              <button onClick={this.handleRenameClick.bind(this)}>Rename Key</button>
            </span>
            <br />
            <span className="transform-field">
              <button onClick={this.addTransformDelete.bind(this)}>Delete Key</button>
            </span>
            <br />
            <span className="transform-field">
              <button onClick={this.addTransformHashify.bind(this)}>Hashify</button>
            </span>
            <section>
              <h2>"Hashify?"</h2>
              <p>Use this transform to convert an array into an object, using the selected keyname as the object ID. See screenshot below for example. Note the id field is selected:</p>
              <img className="screenshot" src="media/hashify.png" />
            </section>
            <h1>Transformations</h1>
            <ol className="transformation-list">
              {transformations}
            </ol>
          </div>
        </TabPanel>

        <TabPanel>
          <textarea value={JSON.stringify(this.processTransformations(), null, ' ')} readOnly name="" id="output" cols="30" rows="10" />
        </TabPanel>

        <TabPanel className="tab-about">
          <h1>JSON-Refactor</h1>
          <p>A JSON refactoring tool.</p>
          <p>
Built and hosted publicly by
            <a title="notmybase.com" href="https://notmybase.com">Hussein Duvigneau</a>
          </p>
          <p>
Available on
            <a title="github.com" href="https://github.com/ElGoorf/json-refactor">GitHub</a>
          </p>
          <h2>Updates</h2>
          <h3>19/02/2017 || Prototype build:</h3>
          <ul>
            <li>JSON input</li>
            <li>
JSON editing:
              <ul>
                <li>Rename Key</li>
                <li>Delete Key</li>
                <li>Hashify Array with Key</li>
              </ul>
            </li>
            <li>JSON output</li>
            <li>Basic layout</li>
          </ul>
          <h3>18/03/2017 || Enhancements:</h3>
          <ul>
            <li>Delete transformations</li>
            <li>Toggle transformations</li>
            <li>Bugfix: deleting and renaming keys updates the breadcrumbs</li>
            <li>Favicon</li>
          </ul>
          <h3>Coming soon...</h3>
          <ul>
            <li>Reorder transformations</li>
            <li>Share (Import/Export) Transformations</li>
            <li>Breadcrumbs legibility/functionality improvements</li>
          </ul>
        </TabPanel>
      </Tabs>
    );
  }
}

export default App;
