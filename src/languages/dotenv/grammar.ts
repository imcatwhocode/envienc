export const grammar = `
Lines
  = lines:(Line / CommentLine / EmptyLine)* {
      let result = lines.reduce((acc, item) => {
        if (item.type === 'comment' || item.type === 'emptyLine') {
          acc._tempComments = acc._tempComments || [];
          acc._tempComments.push(item.value);
        } else if (item.type === 'line') {
          acc[item.key] = { value: item.value };
          if (item.followedByNewline) {
            acc[item.key].followedByNewline = item.followedByNewline;
          }
          if (item.multilineMode) {
            acc[item.key].multilineMode = item.multilineMode;
          }
          if (acc._tempComments) {
            acc[item.key].comments = acc._tempComments;
            delete acc._tempComments;
          }
        }
        return acc;
      }, {});
      
      // Assign remaining _tempComments to __orphanComments
      if (result._tempComments) {
        result.__orphanComments = {
          comments: result._tempComments,
          value: '',
          followedByNewline: false,
        };
        delete result._tempComments;
      }
      
      return result;
    }

Line
  = _ line:StrippedLine _ "\\n"* { return line }

CommentLine
  = _ comment:Comment _ "\\n"? { return {type: 'comment', value: comment} }

EmptyLine
  = _ "\\n" { return {type: 'emptyLine', value: ""} }

StrippedLine "line with whitespace stripped out"
  = key:Key "=" value:Value followedByNewline:FollowedByNewline? { return {type: 'line', key, ...value, followedByNewline: !!followedByNewline} }
  / key:Key { return {type: 'line', key, value: true} } // Handle key-only entries

FollowedByNewline
  = "\\n" "\\n"+ { return true }

Comment
  = "#" comment:[^\\n]* { return comment.join('') }

Key
  = first:[a-zA-Z_] rest:[a-zA-Z_0-9]* { return first + rest.join('') }

Value
  = "'" val:([^'\\n]*) "'" _ Comment? { return {value: val.join('')} }
  / '"' val:MultiLineValue '"' _ Comment? {
      const value = val.replace('\\\\n','\\n');
      const multilineMode = val.includes('\\\\n') ? 'ESCAPE' : (val.includes('\\n') ? 'RESOLVE' : undefined);
      return {value, multilineMode};
    }
  / val:([^\\n#]*) _ Comment? { return {value: val.join('').trim()} }

MultiLineValue
  = chars:( [^"] / "\\\\\\"" / '\\n' )+ { return chars.join('') }

_ "whitespace"
  = [ \\t\\r]* 
`;
