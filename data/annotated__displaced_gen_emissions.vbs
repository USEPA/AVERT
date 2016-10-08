Sub displaced_gen_emissions()

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''       Author:             Pat Knight                                                      '''''
'''''       Project:            12-094                                                          '''''
'''''       Date created:       03 Feb 2012                                                     '''''
'''''       Date modified:      04 Dec 2013                                                     '''''
'''''       Description:        This finds displaced generation and emissions.                  '''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'This speeds up the calculations.
Application.ScreenUpdating = False
Application.Calculation = xlCalculationManual
Application.DisplayStatusBar = True
Application.StatusBar = "0% Complete"

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'This creates the deltas.

'Checks to see if the "Data" sheet has been added yet.
Dim ws As Worksheet
On Error Resume Next
Set ws = Sheets("Data")
On Error GoTo 0
If ws Is Nothing Then
    MsgBox "Data sheet has not yet been created. Please go to Step 2.", vbOKOnly, "AVERT"
    GoTo macroExit:
End If

'This gets the dimensions of various arrays
Sheets("Data").Activate
Dim lastColRow2 As Double
Dim lastRowColA As Double
Dim lastRowColJ As Double
lastColRow2 = Range("O2").End(xlToRight).Column                                     'Number of bins + 10
lastRowColA = Range("A10000").End(xlUp).Row                                         'Number of hours + 3
lastRowColJ = Range("H2000").End(xlUp).Row                                          'Number of units + 4

'This gets the values for the max and min bins.
Dim minBin As Double
Dim maxBin As Double
minBin = ActiveSheet.Cells(2, 16)
maxBin = ActiveSheet.Cells(2, lastColRow2)

'This is an array that contains the blocks of region-wide load
Dim genBlockArray()
genBlockArray = Range(Cells(2, 16), Cells(2, lastColRow2))

'These are arrays that contain the plant-specific data on generation and emissions
Dim genArray()
genArray = Range(Cells(5, 16), Cells(lastRowColJ, lastColRow2))

Dim SO2OzoneArray()
SO2OzoneArray = Range(Cells(2005, 16), Cells(2000 + lastRowColJ, lastColRow2))

Dim SO2NoOzoneArray()
SO2NoOzoneArray = Range(Cells(4005, 16), Cells(4000 + lastRowColJ, lastColRow2))

Dim NOxOzoneArray()
NOxOzoneArray = Range(Cells(6005, 16), Cells(6000 + lastRowColJ, lastColRow2))

Dim NOxNoOzoneArray()
NOxNoOzoneArray = Range(Cells(8005, 16), Cells(8000 + lastRowColJ, lastColRow2))

Dim CO2OzoneArray()
CO2OzoneArray = Range(Cells(10005, 16), Cells(10000 + lastRowColJ, lastColRow2))

Dim CO2NoOzoneArray()
CO2NoOzoneArray = Range(Cells(12005, 16), Cells(12000 + lastRowColJ, lastColRow2))

Dim HeatOzoneArray()
HeatOzoneArray = Range(Cells(14005, 16), Cells(14000 + lastRowColJ, lastColRow2))

Dim HeatNoOzoneArray()
HeatNoOzoneArray = Range(Cells(16005, 16), Cells(16000 + lastRowColJ, lastColRow2))

Sheets("Generation").Activate

'This is an array that contains the 8760/8784 of original load and post-EE load
Dim loadArray()
loadArray = Range("D4:F" & lastRowColA)
Dim loadArray_length As Long
loadArray_length = UBound(loadArray, 1)

'This is an array for peak generation, total generation, and capacity factors.
Dim totalGen()
ReDim totalGen(1 To 3, 1 To lastRowColJ - 4)

'These are arrays for building monthly data.
Dim monthlySum()
ReDim monthlySum(1 To 12, 1 To lastRowColJ - 4)

Dim monthRefArray()
ReDim monthRefArray(1 To 12, 1 To 2)

If ActiveSheet.Cells(4, 2) Mod 4 = 0 Then febMod = 29 Else febMod = 28

startRow = 4
For N = 1 To 12
    
    If N = 1 Or N = 3 Or N = 5 Or N = 7 Or N = 8 Or N = 10 Or N = 12 Then
        monthLength = 31
    ElseIf N = 4 Or N = 6 Or N = 9 Or N = 11 Then
        monthLength = 30
    ElseIf N = 2 Then
        monthLength = febMod
    End If
    
    monthRefArray(N, 1) = startRow
    monthRefArray(N, 2) = startRow - 1 + monthLength * 24
    
    startRow = startRow + monthLength * 24
    
Next N

'This is an intermediate array that matches the position of each of the fossil load values in genBlockArray.
Dim matchedArray()
ReDim matchedArray(1 To loadArray_length, 1 To 2)
For x = 1 To loadArray_length
    If loadArray(x, 1) >= minBin And loadArray(x, 1) <= maxBin And loadArray(x, 3) >= minBin And loadArray(x, 3) <= maxBin Then
        matchedArray(x, 1) = Application.Match(loadArray(x, 1), genBlockArray, 1)
        matchedArray(x, 2) = Application.Match(loadArray(x, 3), genBlockArray, 1)
    End If
Next x

If loadArray_length = 8760 Then
    mayStart = 2881
    octStart = 6553
ElseIf loadArray_length = 8784 Then
    mayStart = 2905
    octStart = 6577
End If

'These are two new arrays that will contain the deltas. This process is split into two arrays because
'large regions (SE, EMW) cause Excel to return an "Out of Memory" error the first time
'each region is run on a machine.
Dim deltaArray_1() As Variant
Dim deltaArray_2() As Variant

'This is a new array that will contain the totals.
Dim totalArray()

'Temporary container for the generation/emissions variable.
Dim plantDataArray()

'Load outside bin range flag

Application.StatusBar = "1% Complete"

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'This creates the displaced generation and emissions for Generation, HeatInput, SO2, NOx, and CO2

statusTick = 1

For a = 1 To 5          'loops through sheets

    On Error GoTo errorHandle:          'Error handler to deal with large regions.
        ReDim deltaArray_1(1 To (lastRowColA - 3) / 2, 1 To lastRowColJ - 4) As Variant
        ReDim deltaArray_2(1 To (lastRowColA - 3) / 2, 1 To lastRowColJ - 4) As Variant
    On Error GoTo 0

    ReDim totalArray(1 To lastRowColA - 3, 1 To 2)

    'Defines the sheets and the source for plantDataArray
    ReDim plantDataArray(1 To lastRowColJ - 4, 1 To lastColRow2 - 15)

    Select Case a
        Case 1
            selectSheet = "Generation"
            plantDataArray = genArray
        Case 2
            selectSheet = "SO2"
            plantDataArray = SO2NoOzoneArray
        Case 3
            selectSheet = "NOx"
            plantDataArray = NOxNoOzoneArray
        Case 4
            selectSheet = "CO2"
            plantDataArray = CO2NoOzoneArray
        Case 5
            selectSheet = "HeatInput"
            plantDataArray = HeatNoOzoneArray
    End Select

    Sheets(selectSheet).Activate

    On Error Resume Next   'turn off error reporting
        ActiveSheet.ShowAllData
    On Error GoTo 0   'turn error reporting back on

    'This splits the selected sheet into twelve sections and deletes each section seperately, before clearing the selection.
    'This is done in order to avoid an "Out of Memory" error for the SE and EMW regions.
    'The max number of units currently encompassed by this line is 1167.
    'The old line of code is as follows:
    ''''''Range(Cells(4, 12), Cells(lastRowColA, 2000)).ClearContents
    For i = 1 To loadArray_length
        Range(Cells(4 + i, 12), Cells(4 + i, 2000)).ClearContents
    Next i

    ' See lines 129 through 135 for mayStart/octStart definitions
    For b = 1 To loadArray_length

        If b = mayStart Then                        'Switches arrays at beginning of May
            If a = 2 Then
                plantDataArray = SO2OzoneArray
            ElseIf a = 3 Then
                plantDataArray = NOxOzoneArray
            ElseIf a = 4 Then
                plantDataArray = CO2OzoneArray
            ElseIf a = 5 Then
                plantDataArray = HeatOzoneArray
            End If
        End If

        If b = octStart Then                        'Switches arrays back at beginning of October
            If a = 2 Then
                plantDataArray = SO2NoOzoneArray
            ElseIf a = 3 Then
                plantDataArray = NOxNoOzoneArray
            ElseIf a = 4 Then
                plantDataArray = CO2NoOzoneArray
            ElseIf a = 5 Then
                plantDataArray = HeatNoOzoneArray
            End If
        End If

        'This skips the matching code and goes to the next hour if either the old or new load is too high or too low.
        ' From line 83: loadArray === Generation sheet. [1] => Regional Load, [2] => EERE Profile, [3] => Regional Load after profile
        ' Dim loadArray()
        ' loadArray = Range("D4:F" & lastRowColA)
        ' minBin === first load bin edge; maxBin === last load bin edge
        If loadArray(b, 1) >= minBin And loadArray(b, 1) <= maxBin And loadArray(b, 3) >= minBin And loadArray(b, 3) <= maxBin Then

            'This matches to the correct block
            ' From line 120-127: This is an intermediate array that matches the position of each of the fossil load values in genBlockArray.
            ' Dim matchedArray()
            ' ReDim matchedArray(1 To loadArray_length, 1 To 2) --> 8760 rows, 2 columns
            ' For x = 1 To loadArray_length
            '     If loadArray(x, 1) >= minBin And loadArray(x, 1) <= maxBin And loadArray(x, 3) >= minBin And loadArray(x, 3) <= maxBin Then
            '         matchedArray(x, 1) = Application.Match(loadArray(x, 1), genBlockArray, 1) --> Returns the index value of the generation value that matches UP TO the lookup loadArray value
            '         matchedArray(x, 2) = Application.Match(loadArray(x, 3), genBlockArray, 1) --> Returns the index value of the PostEERE value up to the lookup loadArray value
            ' Match is like lookup, but returns the index
            '     End If
            ' Next x
            block1A = matchedArray(b, 1) ' generation match index
            block2A = block1A + 1 ' Next gen index value after matched?

            block1B = matchedArray(b, 2) ' postEERE match
            block2B = block1B + 1 ' Next postEERE index value after matched?

            For c = 1 To lastRowColJ - 4
                
                'pre ' plantDataArray --> genArray, so2, nox, co2
                ' plantDataArray(c, block1A) --> c is specific hour row, block1A is column index value. Takes value that matches loadArray and subtracts the one next to it. 
                ' 
                ' genBlockArray
                ' This is an array that contains the blocks of region-wide load
                ' Dim genBlockArray()
                ' genBlockArray = Range(Cells(2, 16), Cells(2, lastColRow2)) --> From data sheet --> All load bin edge values
                slopeA = (plantDataArray(c, block1A) - plantDataArray(c, block2A)) / (genBlockArray(1, block1A) - genBlockArray(1, block2A)) '--> (matched pre gen - next highest pre gen) / (matched pre edge - next highest pre edge)
                interceptA = plantDataArray(c, block1A) - slopeA * genBlockArray(1, block1A) ' matched gen - (slope * matched edge)
                valA = loadArray(b, 1) * slopeA + interceptA ' [regional load for that hour] * slope + intercept'
                
                'post
                slopeB = (plantDataArray(c, block1B) - plantDataArray(c, block2B)) / (genBlockArray(1, block1B) - genBlockArray(1, block2B)) '--> (matched post gen - next post gen) / (matched post edge - next post edge)
                interceptB = plantDataArray(c, block1B) - slopeB * genBlockArray(1, block1B) ' matched post gen - (post slope * matched post edge)'
                valB = loadArray(b, 3) * slopeB + interceptB ' [post regional load for that hour] * post slope + post intercept'

                deltaV = Round(valB - valA, 3)

                If b <= (lastRowColA - 3) / 2 Then
                    deltaArray_1(b, c) = deltaV
                Else
                    deltaArray_2(b - ((lastRowColA - 3) / 2), c) = deltaV
                End If

                totalArray(b, 1) = Round(totalArray(b, 1) + valA, 3)
                totalArray(b, 2) = Round(totalArray(b, 2) + valB, 3)

                'Creates array with peak generation, total generation, and capacity factor.
                If selectSheet = "Generation" Then
                    If valB > totalGen(1, c) Then
                        totalGen(1, c) = Round(valB, 3)
                    End If
                    totalGen(2, c) = Round(totalGen(2, c) + valB, 3)
                    If totalGen(1, c) = 0 Then
                        totalGen(3, c) = 0
                    Else
                        totalGen(3, c) = Round(totalGen(2, c) / (totalGen(1, c) * loadArray_length), 3)
                    End If

                End If

            Next c

        Else

            'Fills in an error message if the load is greater or smaller than the allowed range.
            If b <= (lastRowColA - 3) / 2 Then
                deltaArray_1(b, 1) = "Load outside of bin range"
            Else
                deltaArray_2(b - ((lastRowColA - 3) / 2), 1) = "Load outside of bin range"
            End If

            totalArray(b, 1) = 0
            totalArray(b, 2) = 0

        End If

    Next b

    'Places arrays on the sheet.
    Range(Cells(4, 12), Cells(((lastRowColA / 2) + 2), lastRowColJ - 4 + 11)) = deltaArray_1
    Range(Cells(((lastRowColA / 2) + 3), 12), Cells(lastRowColA, lastRowColJ - 4 + 11)) = deltaArray_2
    Application.CutCopyMode = False
    Range(Cells(4, 9), Cells(lastRowColA, 10)) = totalArray

    If selectSheet = "Generation" Then
        Range(Cells(lastRowColA + 2, 12), Cells(lastRowColA + 4, lastRowColJ - 4 + 11)) = totalGen
    End If

    'This builds an array that summarizes data by month. This is done for each sheet.
    For c = 1 To lastRowColJ - 4
        For d = 1 To 12
            monthlySum(d, c) = Round(Application.Sum(ActiveSheet.Range(Cells(monthRefArray(d, 1), 11 + c), Cells(monthRefArray(d, 2), 11 + c))), 3)
        Next d
    Next c
    Range(Cells(lastRowColA + 10, 12), Cells(lastRowColA + 21, lastRowColJ - 4 + 11)) = monthlySum

    'This finishes the "complete bar"
    Select Case a
        Case 1
            Application.StatusBar = String(3, ChrW(9609)) & " 24% Complete"
        Case 2
            Application.StatusBar = String(4, ChrW(9609)) & " 41% Complete"
        Case 3
            Application.StatusBar = String(6, ChrW(9609)) & " 58% Complete"
        Case 4
            Application.StatusBar = String(8, ChrW(9609)) & " 75% Complete"
        Case 5
            Application.StatusBar = String(9, ChrW(9609)) & " 92% Complete"
    End Select

    Application.GoTo Reference:=Range("A1"), Scroll:=True

Next a

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'This creates the summary sheet

'This clears out old information and formatting.
Sheets("Summary").Activate

On Error Resume Next   'turn off error reporting
    ActiveSheet.ShowAllData
On Error GoTo 0   'turn error reporting back on

LastRowSum = Range("C1000000").End(xlUp).Row
Range("C8:V" & LastRowSum + 1).ClearContents
Application.CutCopyMode = False
Range("C8:V" & LastRowSum + 1).Select
myBorders = Array(xlEdgeLeft, _
    xlEdgeTop, _
    xlEdgeBottom, _
    xlEdgeRight, _
    xlInsideHorizontal)
For Each Item In myBorders
    Selection.Borders(Item).LineStyle = xlNone
Next Item

ActiveSheet.Cells.EntireRow.Hidden = False

'Inserts the plant information
Sheets("Data").Activate
ActiveSheet.Range("M5:O" & lastRowColJ).Copy        'ORSPL, Unit ID, unit names
Sheets("Summary").Range("Y1").PasteSpecial Transpose:=True

'Inserts summary formulas
Sheets("Summary").Activate

'Gets unit information, not related to generation.
ActiveSheet.Cells(4, 25).Formula = "=Generation!L" & lastRowColA + 9      'fuel
ActiveSheet.Cells(5, 25).Formula = "=Generation!L" & lastRowColA + 5      'state
ActiveSheet.Cells(6, 25).Formula = "=Generation!L" & lastRowColA + 6      'county
ActiveSheet.Cells(7, 25).Formula = "=Generation!L" & lastRowColA + 7      'lat
ActiveSheet.Cells(8, 25).Formula = "=Generation!L" & lastRowColA + 8      'lon

'Brings in peak generation, total generation, and capacity factor data.
ActiveSheet.Cells(9, 25).Formula = "=Generation!L" & lastRowColA + 2      'peak gen
ActiveSheet.Cells(10, 25).Formula = "=Generation!L" & lastRowColA + 3     'total gen
ActiveSheet.Cells(11, 25).Formula = "=Generation!L" & lastRowColA + 4     'cap factor

ActiveSheet.Cells(12, 25).Formula = "=SUM(Generation!L4:L" & lastRowColA & ")"                   'Gets the annual delta gen of the first unit
ActiveSheet.Cells(13, 25).Formula = "=SUM(SO2!L4:L" & lastRowColA & ")"                          'Gets the annual delta SO2 of the first unit
ActiveSheet.Cells(14, 25).Formula = "=SUM(NOx!L4:L" & lastRowColA & ")"                          'Gets the annual delta NOx of the first unit
ActiveSheet.Cells(15, 25).Formula = "=SUM(CO2!L4:L" & lastRowColA & ")"                          'Gets the annual delta CO2 of the first unit
ActiveSheet.Cells(16, 25).Formula = "=SUM(CO2!L4:L" & lastRowColA & ")"                          'Gets the annual delta heat input of the first unit

ActiveSheet.Cells(17, 25).Formula = "=SUMIFS(SO2!L4:L" & lastRowColA & "," & _
    "SO2!$C4:$C" & lastRowColA & "," & Chr(34) & ">=5" & Chr(34) & "," & _
    "SO2!$C4:$C" & lastRowColA & "," & Chr(34) & "<=9" & Chr(34) & ")"                          'Gets the ozone season delta SO2 of the first unit
ActiveSheet.Cells(18, 25).Formula = "=SUMIFS(NOX!L4:L" & lastRowColA & "," & _
    "NOX!$C4:$C" & lastRowColA & "," & Chr(34) & ">=5" & Chr(34) & "," & _
    "NOX!$C4:$C" & lastRowColA & "," & Chr(34) & "<=9" & Chr(34) & ")"                          'Gets the ozone season delta NOx of the first unit
ActiveSheet.Cells(19, 25).Formula = "=SUMIFS(SO2!L4:L" & lastRowColA & "," & _
    "SO2!$C4:$C" & lastRowColA & "," & Chr(34) & ">=5" & Chr(34) & "," & _
    "SO2!$C4:$C" & lastRowColA & "," & Chr(34) & "<=9" & Chr(34) & "," & _
    "SO2!$F4:$F" & lastRowColA & "," & Chr(34) & ">=" & Chr(34) & Chr(38) & "LARGE(" & "SO2!$F4:$F" & lastRowColA & ",10))"         'Gets the 10 peak days delta SO2 of the first unit
ActiveSheet.Cells(20, 25).Formula = "=SUMIFS(NOX!L4:L" & lastRowColA & "," & _
    "NOX!$C4:$C" & lastRowColA & "," & Chr(34) & ">=5" & Chr(34) & "," & _
    "NOX!$C4:$C" & lastRowColA & "," & Chr(34) & "<=9" & Chr(34) & "," & _
    "NOX!$F4:$F" & lastRowColA & "," & Chr(34) & ">=" & Chr(34) & Chr(38) & "LARGE(" & "NOX!$F4:$F" & lastRowColA & ",10))"         'Gets the 10 peak days delta NOx of the first unit

'This fills the formulas across.
Range(Cells(4, 25), Cells(20, lastRowColJ + 15)).Select
Selection.FillRight
Calculate

'This copies and transposes the data.
Range(Cells(1, 25), Cells(20, lastRowColJ + 15)).Select
Selection.Copy
Range("C8").Select
Selection.PasteSpecial Paste:=xlPasteValues, Operation:=xlNone, SkipBlanks:=False, Transpose:=True
Application.CutCopyMode = False

'This sorts the information by state and unit.
Range(Cells(8, 3), Cells(lastRowColJ - 3, 22)).Sort _
    key1:=Range("G2"), order1:=xlAscending, _
    key2:=Range("E2"), Order2:=xlAscending, Header:=xlNo

'This deletes the original data.
For N = 25 To 2100
    Columns(N).ClearContents
Next N

LastRowSum = Range("C1000000").End(xlUp).Row

Range("C8:V" & LastRowSum).Select
myBorders = Array(xlEdgeLeft, _
    xlEdgeTop, _
    xlEdgeBottom, _
    xlEdgeRight)
For Each Item In myBorders
    With Selection.Borders(Item)
        .LineStyle = xlContinuous
        .ThemeColor = 1
        .Weight = xlThin
        .TintAndShade = -0.499984740745262
    End With
Next Item

With Selection
    .HorizontalAlignment = xlCenter
    .VerticalAlignment = xlBottom
    .WrapText = False
End With

Range("C8:C" & LastRowSum).NumberFormat = "#"
Range("I8:J" & LastRowSum).NumberFormat = "#,##0.00"
Range("K8:V" & LastRowSum).NumberFormat = "#,##0"

Range("M8:M" & LastRowSum).Select
Selection.Style = "Percent"

'hides unnecessary rows
Rows("1:" & LastRowSum + 1).Select
Selection.EntireRow.Hidden = False

Rows(LastRowSum + 2 & ":" & LastRowSum + 2).Select
Range(Selection, Selection.End(xlDown)).Select
Selection.EntireRow.Hidden = True

With ActiveSheet.PageSetup
    .PrintArea = "$A$1:$X$" & LastRowSum + 1
    .PrintTitleRows = "$1:$7"
    .Orientation = xlLandscape
    .FitToPagesWide = 1
End With

Application.GoTo Reference:=Range("A1"), Scroll:=True


'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'This does the formulas for the Top Ten Chart.

Sheets("ChartData").Activate

On Error Resume Next   'turn off error reporting
    ActiveSheet.ShowAllData
On Error GoTo 0   'turn error reporting back on

Range("F4").Formula = "=SUMIFS(Generation!$D$4:$D$" & lastRowColA & ",CalculateEERE!$E5:$E" & lastRowColA + 1 & ",C4,CalculateEERE!$F5:$F" & lastRowColA + 1 & ",D4)"
Range("G4").Formula = "=SUMIFS(Generation!$E$4:$E$" & lastRowColA & ",CalculateEERE!$E5:$E" & lastRowColA + 1 & ",C4,CalculateEERE!$F5:$F" & lastRowColA + 1 & ",D4)"
Range("H4").Formula = "=SUMIFS(Generation!$K$4:$K$" & lastRowColA & ",CalculateEERE!$E5:$E" & lastRowColA + 1 & ",C4,CalculateEERE!$F5:$F" & lastRowColA + 1 & ",D4)"
Range("I4").Formula = "=SUMIFS('SO2'!$K$4:$K$" & lastRowColA & ",CalculateEERE!$E5:$E" & lastRowColA + 1 & ",C4,CalculateEERE!$F5:$F" & lastRowColA + 1 & ",D4)"
Range("J4").Formula = "=SUMIFS(NOx!$K$4:$K$" & lastRowColA & ",CalculateEERE!$E5:$E" & lastRowColA + 1 & ",C4,CalculateEERE!$F5:$F" & lastRowColA + 1 & ",D4)"
Range("K4").Formula = "=SUMIFS('CO2'!$K$4:$K$" & lastRowColA & ",CalculateEERE!$E5:$E" & lastRowColA + 1 & ",C4,CalculateEERE!$F5:$F" & lastRowColA + 1 & ",D4)"

Range("F4:K4").Copy
Range("F4:K369").Select
Selection.PasteSpecial Paste:=xlPasteFormulas
Application.CutCopyMode = False

Application.GoTo Reference:=Range("A1"), Scroll:=True

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'This creates the Annual County Summary Sheet.

'This clears out old information and formatting.
Sheets("3_CtySummary").Activate

On Error Resume Next   'turn off error reporting
    ActiveSheet.ShowAllData
On Error GoTo 0   'turn error reporting back on

ActiveSheet.Cells.EntireRow.Hidden = False

LastRow3 = Range("C1000000").End(xlUp).Row
Range("C8:O" & LastRow3 + 1).ClearContents
Application.CutCopyMode = False
Range("C8:O" & LastRow3 + 1).Select
myBorders = Array(xlEdgeLeft, _
    xlEdgeTop, _
    xlEdgeBottom, _
    xlEdgeRight, _
    xlInsideHorizontal)
For Each Item In myBorders
    Selection.Borders(Item).LineStyle = xlNone
Next Item

ActiveSheet.Cells.EntireRow.Hidden = False

'Copies list of counties and removes duplicates
Sheets("Summary").Activate

Range("G8:H8").Select
Range(Selection, Selection.End(xlDown)).Select
Selection.Copy
Application.GoTo Reference:=Range("A1"), Scroll:=True

Sheets("3_CtySummary").Select
Range("C8").Select
Selection.PasteSpecial Paste:=xlPasteValues, Operation:=xlNone, SkipBlanks:=False, Transpose:=False
Application.CutCopyMode = False
LastRow3 = Range("C1000000").End(xlUp).Row
ActiveSheet.Range("$C$8:$D$" & LastRow3).RemoveDuplicates Columns:=Array(1, 2), Header:=xlNo

LastRowCty = Range("C1000000").End(xlUp).Row

'Drops in formulas to summarize by state and county.

If febMod = 29 Then annualHours = 8784 Else annualHours = 8760
For a = 8 To LastRowCty
    For b = 1 To 11
        If b = 1 Then
            ActiveSheet.Cells(a, b + 4).Formula = "=SUMIFS(Summary!" & _
                Cells(8, b + 10).Address & ":" & Cells(LastRowSum, b + 10).Address & "," & _
                "Summary!" & Cells(8, 7).Address & ":" & Cells(LastRowSum, 7).Address & "," & Chr(34) & ActiveSheet.Cells(a, 3) & Chr(34) & "," & _
                "Summary!" & Cells(8, 8).Address & ":" & Cells(LastRowSum, 8).Address & "," & Chr(34) & ActiveSheet.Cells(a, 4) & Chr(34) & ")"
        ElseIf b = 2 Then
            ActiveSheet.Cells(a, b + 4).Formula = "=IF(ROUND(SUMIFS(Summary!" & _
                Cells(8, b + 10).Address & ":" & Cells(LastRowSum, b + 10).Address & "," & _
                "Summary!" & Cells(8, 7).Address & ":" & Cells(LastRowSum, 7).Address & "," & Chr(34) & ActiveSheet.Cells(a, 3) & Chr(34) & "," & _
                "Summary!" & Cells(8, 8).Address & ":" & Cells(LastRowSum, 8).Address & "," & Chr(34) & ActiveSheet.Cells(a, 4) & Chr(34) & "),-2)=0," & Chr(34) & Chr(150) & Chr(34) & _
                ",ROUND(SUMIFS(Summary!" & Cells(8, b + 10).Address & ":" & Cells(LastRowSum, b + 10).Address & "," & _
                "Summary!" & Cells(8, 7).Address & ":" & Cells(LastRowSum, 7).Address & "," & Chr(34) & ActiveSheet.Cells(a, 3) & Chr(34) & "," & _
                "Summary!" & Cells(8, 8).Address & ":" & Cells(LastRowSum, 8).Address & "," & Chr(34) & ActiveSheet.Cells(a, 4) & Chr(34) & "),-2))"
        Else
            ActiveSheet.Cells(a, b + 4).Formula = "=IF(ROUND(SUMIFS(Summary!" & _
                Cells(8, b + 11).Address & ":" & Cells(LastRowSum, b + 11).Address & "," & _
                "Summary!" & Cells(8, 7).Address & ":" & Cells(LastRowSum, 7).Address & "," & Chr(34) & ActiveSheet.Cells(a, 3) & Chr(34) & "," & _
                "Summary!" & Cells(8, 8).Address & ":" & Cells(LastRowSum, 8).Address & "," & Chr(34) & ActiveSheet.Cells(a, 4) & Chr(34) & "),-2)=0," & Chr(34) & Chr(150) & Chr(34) & _
                ",ROUND(SUMIFS(Summary!" & Cells(8, b + 11).Address & ":" & Cells(LastRowSum, b + 11).Address & "," & _
                "Summary!" & Cells(8, 7).Address & ":" & Cells(LastRowSum, 7).Address & "," & Chr(34) & ActiveSheet.Cells(a, 3) & Chr(34) & "," & _
                "Summary!" & Cells(8, 8).Address & ":" & Cells(LastRowSum, 8).Address & "," & Chr(34) & ActiveSheet.Cells(a, 4) & Chr(34) & "),-2))"
        End If
    Next b
Next a

'Formats the data, then copies and pastes it as values.

Range("C8:O" & LastRowCty).Select
With Selection
    .HorizontalAlignment = xlCenter
    .VerticalAlignment = xlBottom
    .WrapText = False
    .NumberFormat = "#,##0"
End With

Range("C8:O8").Select
Range(Selection, Selection.End(xlDown)).Select
myBorders = Array(xlEdgeLeft, _
    xlEdgeTop, _
    xlEdgeBottom, _
    xlEdgeRight)
For Each Item In myBorders
    With Selection.Borders(Item)
        .LineStyle = xlContinuous
        .ThemeColor = 1
        .Weight = xlThin
        .TintAndShade = -0.499984740745262
    End With
Next Item

Calculate

Range("C8:O" & LastRowCty).Select
Selection.Copy
Range("C8").Select
Selection.PasteSpecial Paste:=xlPasteValues

'Sorts the data by state and county.
Range("C8:O" & LastRowCty).Sort _
    key1:=Range("C8"), order1:=xlAscending, _
    key2:=Range("D8"), Order2:=xlAscending, Header:=xlNo

'hides unnecessary rows
summaryCtyLength = Range("C1000000").End(xlUp).Row

Rows("1:" & summaryCtyLength + 1).Select
Selection.EntireRow.Hidden = False

Rows(summaryCtyLength + 2 & ":" & summaryCtyLength + 2).Select
Range(Selection, Selection.End(xlDown)).Select
Selection.EntireRow.Hidden = True

Sheets("3_CtySummary").Activate
With ActiveSheet.PageSetup
    .PrintArea = "$A$1:$Q$" & summaryCtyLength + 1
    .PrintTitleRows = "$1:$7"
    .Orientation = xlLandscape
    .FitToPagesWide = 1
End With

Application.GoTo Reference:=Range("A1"), Scroll:=True

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'This creates the county monthly sheet

'This clears out old information and formatting.
Sheets("4_CtyMonthly").Activate

On Error Resume Next   'turn off error reporting
    ActiveSheet.ShowAllData
On Error GoTo 0   'turn error reporting back on

ActiveSheet.Cells.EntireRow.Hidden = False

LastRow4 = Range("C1000000").End(xlUp).Row
Range("C8:I" & LastRow4 + 1).ClearContents                                   'This is currently set up to only clear 10000 counties. This will need to be revised if more units are added to a region.
Application.CutCopyMode = False
Range("C8:I" & LastRow4 + 1).Select
myBorders = Array(xlEdgeLeft, _
    xlEdgeTop, _
    xlEdgeBottom, _
    xlEdgeRight, _
    xlInsideHorizontal)
For Each Item In myBorders
    Selection.Borders(Item).LineStyle = xlNone
Next Item
ActiveSheet.Cells.EntireRow.Hidden = False

'This clears out old information and formatting.
Sheets("ChartData").Activate

Range("AO8:AU10000").ClearContents                                     'This is currently set up to only clear 10000 counties. This will need to be revised if more units are added to a region.
Application.CutCopyMode = False

'Copies list of counties and removes duplicates
Sheets("3_CtySummary").Activate
Range("C8:D8").Select
Range(Selection, Selection.End(xlDown)).Select
Selection.Copy
Application.GoTo Reference:=Range("A1"), Scroll:=True

Sheets("ChartData").Select
Range("AO4").Select
Selection.PasteSpecial Paste:=xlPasteValues
Application.CutCopyMode = False

LastRowCtyM = Range("AO1000000").End(xlUp).Row

'Creates enough duplicates for months and enters labels

tickTop = 4
tickCty = LastRowCtyM

For a = 1 To 12

    ActiveSheet.Range("AQ" & tickTop & " :AQ" & tickCty) = a

    Range("AO" & tickTop & ":AP" & tickCty).Copy
    Range("AO" & tickCty + 1).Select
    Selection.PasteSpecial Paste:=xlPasteValues
    Application.CutCopyMode = False

    tickTop = tickCty + 1
    tickCty = Range("AO1000000").End(xlUp).Row

Next a

ActiveSheet.Range("AQ" & tickTop & " :AQ" & tickCty) = "Annual"

'Enters formulas for displacement.

LastRowCtyM = Range("AO1000000").End(xlUp).Row

For a = 4 To LastRowCtyM

    If ActiveSheet.Cells(a, 43) <> "Annual" Then

        For b = 44 To 47

            Select Case b
                Case 44
                    sheetTrace = "Generation"
                Case 45
                    sheetTrace = "SO2"
                Case 46
                    sheetTrace = "NOx"
                Case 47
                    sheetTrace = "CO2"
            End Select

            ActiveSheet.Cells(a, b).Formula = "=SUMIFS(" & sheetTrace & "!" & _
                Cells(loadArray_length + 12 + ActiveSheet.Cells(a, 43), 12).Address & ":" & _
                Cells(loadArray_length + 12 + ActiveSheet.Cells(a, 43), lastRowColJ + 7).Address & "," & "Generation!" & _
                Cells(loadArray_length + 8, 12).Address & ":" & _
                Cells(loadArray_length + 8, lastRowColJ + 7).Address & "," & Chr(34) & ActiveSheet.Cells(a, 41) & Chr(34) & "," & "Generation!" & _
                Cells(loadArray_length + 9, 12).Address & ":" & _
                Cells(loadArray_length + 9, lastRowColJ + 7).Address & "," & Chr(34) & ActiveSheet.Cells(a, 42) & Chr(34) & ")"
        Next b

    Else  'special case to sum up annual data

        If ActiveSheet.Cells(a - 1, 43) = 12 Then
            endMonthlyData = a - 1
        End If

        For b = 44 To 47

            Select Case b
                Case 44
                    sheetTrace = "Generation"
                Case 45
                    sheetTrace = "SO2"
                Case 46
                    sheetTrace = "NOx"
                Case 47
                    sheetTrace = "CO2"
            End Select

            ActiveSheet.Cells(a, b).Formula = "=SUMIFS(" & _
                Cells(4, b).Address & ":" & _
                Cells(endMonthlyData, b).Address & "," & _
                Cells(4, 41).Address & ":" & _
                Cells(endMonthlyData, 41).Address & "," & Chr(34) & ActiveSheet.Cells(a, 41) & Chr(34) & "," & _
                Cells(4, 42).Address & ":" & _
                Cells(endMonthlyData, 42).Address & "," & Chr(34) & ActiveSheet.Cells(a, 42) & Chr(34) & ")"

        Next b

    End If

Next a

'Pastes data as values
Calculate

Range("AO4:AU" & LastRowCtyM).Select
Selection.Copy
Range("AO4").Select
Selection.PasteSpecial Paste:=xlPasteValues

'Sorts the data by state and county.
Range("AO8:AU" & LastRowCtyM).Sort _
    key1:=Range("AO8"), order1:=xlAscending, _
    key2:=Range("AP8"), Order2:=xlAscending, Header:=xlNo

'Swaps to "4_CtyMonthly" and links the data

LastRowCtyM = Range("AO1000000").End(xlUp).Row

Sheets("4_CtyMonthly").Activate

For a = 8 To LastRowCtyM - 4
    For b = 3 To 9
        If b < 6 Then
            ActiveSheet.Cells(a, b).FormulaR1C1 = "=ChartData!R[-4]C[38]"
        Else
            ActiveSheet.Cells(a, b).FormulaR1C1 = "=IF(ROUND(ChartData!R[-4]C[38],-2)=0," & Chr(34) & Chr(150) & Chr(34) & ",ROUND(ChartData!R[-4]C[38],-2))"
        End If
    Next b
Next a

Range("C8:I" & LastRowCtyM - 4).Select

With Selection
    .HorizontalAlignment = xlCenter
    .VerticalAlignment = xlBottom
    .WrapText = False
    .NumberFormat = "#,##0"
End With

myBorders = Array(xlEdgeLeft, _
    xlEdgeTop, _
    xlEdgeBottom, _
    xlEdgeRight)
For Each Item In myBorders
    With Selection.Borders(Item)
        .LineStyle = xlContinuous
        .ThemeColor = 1
        .Weight = xlThin
        .TintAndShade = -0.499984740745262
    End With
Next Item

Calculate

Selection.Copy
Range("C8").Select
Selection.PasteSpecial Paste:=xlPasteValues

'Sorts the data by state and county.
Range("C8:I" & LastRowCtyM - 4).Sort _
    key1:=Range("C8"), order1:=xlAscending, _
    key2:=Range("D8"), Order2:=xlAscending, Header:=xlNo

'hides unnecessary rows

Rows("1:" & LastRowCtyM - 3).Select
Selection.EntireRow.Hidden = False

Rows(LastRowCtyM - 2 & ":" & LastRowCtyM - 2).Select
Range(Selection, Selection.End(xlDown)).Select
Selection.EntireRow.Hidden = True

Sheets("4_CtyMonthly").Activate
With ActiveSheet.PageSetup
    .PrintArea = "$A$1:$K$" & LastRowCtyM - 3
    .PrintTitleRows = "$1:$7"
    .Orientation = xlLandscape
    .FitToPagesWide = 1
End With

Application.GoTo Reference:=Range("A1"), Scroll:=True

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'This creates the dropdowns for the Monthly display sheet.

Sheets("ChartData").Activate

On Error Resume Next   'turn off error reporting
    ActiveSheet.ShowAllData
On Error GoTo 0   'turn error reporting back on

Range("AH18:AK500").ClearContents

Sheets("3_CtySummary").Activate                  'Copies state & county data
Range("C8:D8").Select
Range(Selection, Selection.End(xlDown)).Select
Selection.Copy
Application.GoTo Reference:=Range("A1"), Scroll:=True

Sheets("ChartData").Select
Range("AH18").Select
Selection.PasteSpecial Paste:=xlPasteValues
Application.CutCopyMode = False

LastRowState = Range("AH1000000").End(xlUp).Row

Range("AH18:AH" & LastRowState).Copy     'Creates a dropdown list for the states only

Range("AJ18").Select
Selection.PasteSpecial Paste:=xlPasteValues
Range("AJ18:AJ" & LastRowState).Select
ActiveSheet.Range("AJ18:AJ" & LastRowState).RemoveDuplicates Columns:=1, Header:=xlNo

LastRowStateDropdown = Range("AJ1000000").End(xlUp).Row
Range("AJ18:AJ" & LastRowStateDropdown).Font.Color = -4210753

ActiveSheet.Cells(18, 37).Formula = "=" & Chr(34) & "S" & Chr(34) & "&17+MATCH(AJ18,$AH$18:$AH$" & LastRowState & ",0)&" & _
    Chr(34) & ":S" & Chr(34) & "&16+MATCH(AJ18,$AH$18:$AH$" & LastRowState & ",0)+COUNTIF($AH$18:$AH" & LastRowState & ",AJ18)"

LastRowStateDropdown = Range("AJ1000000").End(xlUp).Row

Range("AK18").Select
Selection.AutoFill Destination:=Range("AK18:AK" & LastRowStateDropdown)

Application.GoTo Reference:=Range("A1"), Scroll:=True

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'This resest the map and hourly charts.

'Resets charts.
Sheets("ChartData").Activate
Range("AW3:MZ171").Select
Selection.Clear

Sheets("6_Monthly").Activate
Range("E7:I9").ClearContents

ActiveSheet.ChartObjects("Chart 1").Activate
ActiveChart.SeriesCollection(1).Select
Selection.Formula = "=SERIES(,'ChartData'!R4C34:R15C34,'ChartData'!R4C36:R15C36,1)"

ActiveSheet.ChartObjects("Chart 2").Activate
ActiveChart.SeriesCollection(1).Select
Selection.Formula = "=SERIES(,'ChartData'!R4C34:R15C34,'ChartData'!R4C37:R15C37,1)"

ActiveSheet.ChartObjects("Chart 3").Activate
ActiveChart.SeriesCollection(1).Select
Selection.Formula = "=SERIES(,'ChartData'!R4C34:R15C34,'ChartData'!R4C38:R15C38,1)"

Application.GoTo Reference:=Range("A1"), Scroll:=True

Sheets("7_Hourly").Activate

'does the first chart
ActiveSheet.ChartObjects("Chart 1").Activate
ActiveChart.SeriesCollection(1).Values = "=CalculateEERE!$V$1:$V$168"
ActiveChart.SeriesCollection(1).XValues = "=CalculateEERE!$V$1:$V$168"

'does the second chart
ActiveSheet.ChartObjects("Chart 2").Activate

maxLoad = 100
minLoad = 0
rangeLoad = maxLoad - minLoad

ActiveChart.Axes(xlValue).MaximumScale = maxLoad
ActiveChart.Axes(xlValue).MinimumScale = minLoad
ActiveChart.Axes(xlValue).MajorUnit = maxLoad - minLoad

ActiveChart.SeriesCollection(1).Values = "=CalculateEERE!$V$1:$V$168"
ActiveChart.SeriesCollection(1).XValues = "=CalculateEERE!$V$1:$V$168"

'does the third chart
ActiveSheet.ChartObjects("Chart 3").Activate

ActiveChart.SeriesCollection(1).Values = "=CalculateEERE!$V$1:$V$168"
ActiveChart.SeriesCollection(2).Values = "=CalculateEERE!$V$1:$V$168"
ActiveChart.SeriesCollection(2).XValues = "=CalculateEERE!$V$1:$V$168"

'Clears out data
Range("F7:J8").ClearContents
Range("C12:C13").ClearContents
Range("C37").ClearContents

Application.GoTo Reference:=Range("A1"), Scroll:=True

'Resets charts.
Sheets("5_Map").Activate

ActiveSheet.ChartObjects("Chart 1").Activate
ActiveChart.SeriesCollection(1).Values = "=CalculateEERE!$V$1:$V$168"
ActiveChart.SeriesCollection(1).XValues = "=CalculateEERE!$V$1:$V$168"
ActiveChart.SeriesCollection(1).BubbleSizes = "=CalculateEERE!$V$1:$V$168"

ActiveChart.SeriesCollection(2).Values = "=CalculateEERE!$V$1:$V$168"
ActiveChart.SeriesCollection(2).XValues = "=CalculateEERE!$V$1:$V$168"
ActiveChart.SeriesCollection(2).BubbleSizes = "=CalculateEERE!$V$1:$V$168"

'Clears out data
Range("C9:C10").ClearContents
Range("F7:J7").ClearContents

Application.GoTo Reference:=Range("A1"), Scroll:=True



'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'This finishes up the Macro.
Sheets("RunDisplacement").Activate

Application.StatusBar = String(10, ChrW(9609)) & " 100% Complete"

Range("C17").Value = "Hourly displaced generation and emissions have been calculated."

calcComplete = MsgBox("Calculation complete. " & vbNewLine & _
    "Click the red " & Chr(34) & "Next" & Chr(34) & " button to continue.", vbOKOnly, "AVERT")
Application.GoTo Reference:=Range("M19"), Scroll:=False

macroExit:

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'This speeds up the calculations.
Application.ScreenUpdating = True
Application.Calculation = xlCalculationAutomatic
Application.StatusBar = False

Calculate

Exit Sub

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'This is an error handler in case Excel encounters an "out of memory" error.

errorHandle:

Sheets("RunDisplacement").Activate

Application.ScreenUpdating = True
Application.Calculation = xlCalculationAutomatic
Application.StatusBar = False

Application.GoTo Reference:=Range("A1"), Scroll:=False
calcComplete = MsgBox("Due to the large size of the AVERT region, Excel has run out of memory. " & vbNewLine & _
    "Please save, close the Main Module, and re-open it.", vbOKOnly, "AVERT")

End Sub
