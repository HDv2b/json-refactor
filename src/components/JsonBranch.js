/**
 * Created by elgoo on 11/02/2017.
 */
import React, { Component } from 'react';
import _ from 'lodash';
import { openCurly, closeCurly } from '../common';

class JsonKey extends Component {
  handleHover(e) {
    e.stopPropagation();
    const trail = this.props.trail;
    this.props.setHoverTrail(trail);
  }

  handleClick(e) {
    e.stopPropagation();
    const trail = this.props.trail;
    this.props.setActiveTrail(trail);
  }

  render() {
    const keyName = this.props.keyName;

    const classNames = ['json-key'];

    const hoverTrail = this.props.hoverTrail;
    const depth = this.props.depth;
    const trail = this.props.trail;

    let hovered = true;
    for (const t in trail) {
      if (trail[t] !== hoverTrail[t]) {
        hovered = false;
        break;
      }
    }

    if (hovered) {
      classNames.push('hovered');
    }

    return (
      <span
        className={classNames.join(' ')}
        onMouseOver={this.handleHover.bind(this)}
        onClick={this.handleClick.bind(this)}
      >
"
        {keyName}
"
      </span>
    );
  }
}

export default class JsonBranch extends Component {
  componentWillMount() {
    this.setState({ visible: true });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const keyName = this.props.trail[this.props.trail.length - 1];

    switch (true) {
      case (this.state.visible != nextState.visible): // if visibility has changed
      case (!this.props.trail.length): // if trail has no length (root key)
      case (this.props.hoverTrail.indexOf(keyName) > -1): // if keyName appears in current hover trail
      case (nextProps.hoverTrail.indexOf(keyName) > -1): // if keyframe is in updated hover trail
      case (this.props.activeTrail && this.props.activeTrail.indexOf(keyName) > -1): // if keyName appears in current active trail
      case (nextProps.activeTrail && nextProps.activeTrail.indexOf(keyName) > -1): // if keyframe is in updated active trail
        return true;
    }

    return false;
  }

  toggleVisibility() {
    this.setState({ visible: !this.state.visible });
  }

  displayVisibility() {
    return this.state.visible ? '-' : '+';
  }

  getArray(branch, keys) {
    // todo: this is an array, so can swap out lodash for native
    const elements = _.map(keys, (key) => {
      // only show comma if not the last element
      const comma = keys.slice(-1)[0] !== key ? <span className="json-punctuation">,</span> : false;

      const trail = this.props.trail;

      return (
        <li key={key}>
          <JsonBranch
            setHoverTrail={this.props.setHoverTrail}
            setActiveTrail={this.props.setActiveTrail}
            hoverTrail={this.props.hoverTrail}
            trail={trail}
            branch={branch[key]}
            depth={this.props.depth}
            key={key}
          />
          {comma}
        </li>
      );
    });
    return <ul>{elements}</ul>;
  }

  getObject(branch, keys) {
    const elements = _.map(keys, (key) => {
      const comma = keys.slice(-1)[0] !== key ? <span className="json-punctuation">,</span> : false;
      const trail = this.props.trail.concat(key);
      return (
        <li key={key}>
          <JsonKey
            keyName={key}
            setHoverTrail={this.props.setHoverTrail}
            setActiveTrail={this.props.setActiveTrail}
            hoverTrail={this.props.hoverTrail}
            depth={this.props.depth}
            trail={trail}
          />
          <span className="json-punctuation">:</span>
&nbsp;
          <JsonBranch
            setHoverTrail={this.props.setHoverTrail}
            setActiveTrail={this.props.setActiveTrail}
            hoverTrail={this.props.hoverTrail}
            trail={trail}
            depth={this.props.depth + 1}
            branch={branch[key]}
            key={key}
          />
          {comma}
        </li>
      );
    });
    return <ul>{elements}</ul>;
  }

  toggleButton() {
    return <button className="toggle" onClick={this.toggleVisibility.bind(this)}>{this.displayVisibility()}</button>;
  }

  getPair(branch, keys) {
    switch (Object.prototype.toString.call(branch)) {
      case '[object Array]':
        return (
          <span className="json-array">
            {this.toggleButton()}
            <span className="json-bracket">[</span>
            {this.getArray(branch, keys)}
            <span className="json-bracket">]</span>
          </span>
        );
      case '[object Object]':
        return (
          <span className="json-object">
            {this.toggleButton()}
            <span className="json-bracket">{openCurly()}</span>
            {this.getObject(branch, keys)}
            <span className="json-bracket">{closeCurly()}</span>
          </span>
        );
      case '[object Number]':
        return <span className="json-number">{branch}</span>;
      case '[object String]':
        return (
          <span className="json-string">
"
            {branch}
"
          </span>
        );
      case '[object Boolean]':
        return <span className="json-boolean">{JSON.stringify(branch)}</span>;
      case '[object Null]':
        return <span className="json-null">null</span>;
    }
  }

  render() {
    const branch = this.props.branch;

    const keys = branch ? Object.keys(branch) : [];

    const classNames = ['json-branch'];

    if (!this.state.visible) {
      classNames.push('hidden');
    }

    const pair = this.getPair(branch, keys);

    return (
      <span className={classNames.join(' ')}>
        {pair}
      </span>
    );
  }
}
