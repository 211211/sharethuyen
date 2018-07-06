import React from "react";
import Trumbowyg from 'react-trumbowyg'

export default class RichTextEditor extends React.Component {
  onChange(content) {
    console.log("onChange", content);
  }

  render() {
    return (
      <Trumbowyg id='react-trumbowyg'/>
    );
  }
}
