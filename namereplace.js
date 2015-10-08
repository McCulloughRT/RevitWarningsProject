exports.NameReplace = NameReplace;

function NameReplace(nameInput) {
  if(~nameInput.indexOf('Option Conflict between Rooms. Room boundary in the Main Model differs from the apparent boundary')) {
    output = 'Option Conflict between Rooms. Room boundary in the Main Model differs from the apparent boundary.';
    return output;
  } else if (~nameInput.indexOf('cannot reference Design Option')) {
    output = 'Design Option cannot reference another Design Option.';
    return output;
  } else if(~nameInput.indexOf('It is not possible to calculate the flow since the flow direction mismatch.')) {
    output = 'It is not possible to calculate the flow since the flow direction mismatch.';
    return output;
  } else if(~nameInput.indexOf('Highlighted walls overlap. One of them may be ignored when Revit finds room boundaries.')) {
    output = 'Highlighted walls overlap. One of them may be ignored when Revit finds room boundaries.';
    return output;
  } else if(~nameInput.indexOf('There are identical instances in the same place. This will result in double counting in schedules.')) {
    output = 'There are identical instances in the same place. This will result in double counting in schedules.';
    return output;
  } else if(~nameInput.indexOf('A wall and a room separation line overlap. One of them may be ignored when Revit finds room boundaries.')) {
    output = 'A wall and a room separation line overlap. One of them may be ignored when Revit finds room boundaries.';
    return output;
  } else if(~nameInput.indexOf('Highlighted lines overlap. Lines may not form closed loops.')) {
    output = 'Highlighted lines overlap. Lines may not form closed loops.';
    return output;
  } else if(~nameInput.indexOf('slightly off axis and may cause inaccuracies')) {
    output = 'An element is slightly off axis and may cause inaccuracies';
    return output;
  } else if(~nameInput.indexOf('Elements have duplicate')) {
    output = 'Elements have duplicate values';
    return output;
  } else if(~nameInput.indexOf('Keynote values from the link will not be displayed.')) {
    output = 'Link and the current model use different keynote tables. Keynote values from the link will not be displayed.';
    return output;
  } else if(~nameInput.indexOf('The bounding geometry (in 3D) cant be found')) {
    output = 'Room volume cant be computed. The bounding geometry (in 3d) cant be found and will be ignored in the energy analysis model.';
    return output;
  } else {
    return nameInput;
  }
}
