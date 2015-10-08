function MarkupWarnings(indx, jsObj) {
  var avg = jsObj.average;

  var min = Math.min.apply(null, jsObj.iqr);
  var max = Math.max.apply(null, jsObj.iqr);
  var range = min.toString() + "-" + max.toString();

  var dev = jsObj.deviation;
  var pct = jsObj.percent;

  var markup = "<div class='panel panel-default'><div class='panel-heading'><h1 class='panel-title' align='center'><b>" + jsObj.warnName + "</b></h1></div><br><div class='warning'><div class='panelTop'> <div class='panelTopEntry'> <p align='center'>Average: <br /><b><font size='6' color='#fc992b'>" + avg + "</font><font size='2' color='#fc992b'> warnings</font></b></p> </div> <div class='panelTopEntry'> <p align='center'>Range: <br /><b><font size='6' color='#fc992b'>" + range + "</font><font size='2' color='#fc992b'> warnings</font></b></p> </div> <div class='panelTopEntry'> <p align='center'>Standard Deviation: <br /><b><font size='6' color='#fc992b' data-toggle='tooltip' data-placement='right' title='Standard deviation measures the amount of variance in a dataset from the mean. 95% of the dataset will fall within 2 standard deviations of the mean.'>" + dev + "</font><font size='2' color='#fc992b'> warnings</font></b></p> </div> </div><div class='leftCol'><p align='center'><b>Descriptive Stats: </b></p><div class='boxChart' id='boxplot" + indx + "' data-toggle='tooltip' data-placement='left' title='This plots the range of values. Top and bottom numbers show minimum and maximum significant values. The middle 50% of data is shown as a green box, and the most commonly occuring value is shown as a light green bar. Outliers (data outside the range of significance) are shown as open circles.'></div></div><div class='centerCol'><p align='center'><b>Percent of Total: <font color='#fc992b'>" + pct + "</font></b></p><br /><div class='piechart' id='piechart" + indx + "'></div></div><div class='rightCol'><p align='center'><b>Change Over Phases: </b></p><br /><div class='lineChart' id='lineChart" + indx + "' data-toggle='tooltip' data-placement='right' title='Average number of warnings per phase. This allows us to see how projects typically change over time.'></div></div></div></div>";
  return markup;
}

function MarkupMain(jsObj) {
  var mainAvg = jsObj.average;

  var nNumber = jsObj.projNumber;

  var mainMin = Math.min.apply(null, jsObj.iqr);
  var mainMax = Math.max.apply(null, jsObj.iqr);
  var mainRange = mainMin.toString() + "-" + mainMax.toString();

  var mainDev = jsObj.deviation;

  var mainMarkup = "<p align='center'><font color='#736868' size='5'>The 'Average' Project: </font></p><div class='warning'><div class='panelTop'> <div class='panelTopEntry'> <p align='center'>The average project has: <br /><b><font size='6' color='#fc992b' data-toggle='tooltip' data-placement='top' title='Average number of warnings in a project'>" + mainAvg + "</font><font size='2' color='#fc992b'> warnings</font></b></p> </div> <div class='panelTopEntry'> <p align='center'>We have recorded values between: <br /><b><font size='6' color='#fc992b' data-toggle='tooltip' data-placement='top' title='Minimum and maximum recorded values.'>" + mainRange + "</font><font size='2' color='#fc992b'> warnings</font></b></p> </div> <div class='panelTopEntry'> <p align='center'>The standard deviation is: <br /><b><font size='6' color='#fc992b' data-toggle='tooltip' data-placement='top' title='Standard deviation measures the amount of variance in a dataset from the mean. 95% of the dataset will fall within 2 standard deviations of the mean.'>" + mainDev + "</font><font size='2' color='#fc992b'> warnings</font></b></p> </div> </div> <div class='leftCol'> <p align='center'><b>Descriptive Stats: </b></p> <div class='charts' id='boxplotMain' data-toggle='tooltip' data-placement='left' title='This plots the range of values. Top and bottom numbers show minimum and maximum significant values. The middle 50% of data is shown as a green box, and the most commonly occuring value is shown as a light green bar. Outliers (data outside the range of significance) are shown as open circles.'></div> </div> <div class='centerCol'> <p align='center'><b>Change over Phases</b></p> <br /> <div class='charts' id='lineChartMain' data-toggle='tooltip' data-placement='left' title='Average number of warnings per phase. This allows us to see how projects typically change over time.'></div> <div class='lists'> <br /> </div> </div> <div class='notesCol'> <p align='left'><b>Notes: </b></p> <p align='left'>This shows the collected statistics<br /> on Revit warning types we<br /> encounter as an office. The left<br />graphic shows range, mode<br />and inter-quartile range.<br /><br />The right graphic shows how<br />a warning fluctuates over time.<br /><br /> The center graphic below shows <br />how common a warning is.</p> </div> </div> <hr> ";
  return mainMarkup;
}

function MarkupIndex(jsObj) {
  var mainAvg = jsObj.average;

  var nNumber = jsObj.projNumber;

  var mainMin = Math.min.apply(null, jsObj.iqr);
  var mainMax = Math.max.apply(null, jsObj.iqr);
  var mainRange = mainMin.toString() + "-" + mainMax.toString();

  var mainDev = jsObj.deviation;

  var indexMarkup = "<p align='center'><font color='#736868' size='5'>Total Number of Projects in Database: <b>" + nNumber + "<b></font></p><div><div class='panelTop'> <div class='panelTopEntry'> <p align='center'>The average project has: <br /><b><font size='6' color='#fc992b'>" + mainAvg + "</font><font size='2' color='#fc992b'> warnings</font></b></p> </div> <div class='panelTopEntry'> <p align='center'>We have recorded values between: <br /><b><font size='6' color='#fc992b'>" + mainRange + "</font><font size='2' color='#fc992b'> warnings</font></b></p> </div> <div class='panelTopEntry'> <p align='center'>The standard deviation is: <br /><b><font size='6' color='#fc992b' data-toggle='tooltip' data-placement='right' title='Standard deviation measures the amount of variance in a dataset from the mean. 95% of the dataset will fall within 2 standard deviations of the mean.'>" + mainDev + "</font><font size='2' color='#fc992b'> warnings</font></b></p> </div> </div> </div> </div>";
  return indexMarkup;
}
