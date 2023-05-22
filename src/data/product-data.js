import jsonData from "./products.json";

const data = JSON.parse(JSON.stringify(jsonData));

export const getFlattenedProductData = () => {
  const products = [];
  Object.keys(data).map((key) => {
    return data[key].forEach((model) => {
      products.push({
        name: key,
        label: model.model,
        catalog: model.catalog,
        cost: model.cost,
      });
    });
  });

  return products;
};

/*""
SLP98UH110XV60C Furnace-Gas/110Bh/5T	60W28	$ 2,401.00
SLP98UH135XV60D Furnace-Gas/135Bt/5T	60W29	$ 2,464.00
EL296UH045XV36B  Furnace-Gas/45Btuh/3Ton	62W87	$ 1,728.00
EL296UH070XV36B  Furnace-Gas/70Btuh/3Ton	62W88	$ 1,834.00
EL296UH090XV36C  Furnace-Gas/90Btuh/3Ton	62W89	$ 1,898.00
EL296UH090XV48C  Furnace-Gas/90Btuh/4Ton	62W90	$ 1,984.00
EL296UH090XV60C  Furnace-Gas/90Btuh/5Ton	62W91	$ 2,005.00
EL296UH110XV48C Furnace-Gas/110Btu/4Ton	62W92	$ 2,048.00
EL296UH110XV60C Furnace-Gas/110Btu/5Ton	62W93	$ 2,104.00
EL296UH135XV60D Furnace-Gas/135Btu/5Ton	62W94	$ 2,214.00
ML193UH045XP24B   Furnace-Gas/45Btuh/2T	55W37	$ 813.00
ML193UH045XP36B   Furnace-Gas/45Btuh/3T	55W38	$ 813.00
ML193UH070XP24B   Furnace-Gas/70Btuh/2T	55W39	$ 916.00
ML193UH070XP36B   Furnace-Gas/70Btuh/3T	55W40	$ 892.00
ML193UH090XP36C   Furnace-Gas/90Btuh/3T	55W41	$ 956.00
ML193UH090XP48C   Furnace-Gas/90Btuh/4T	55W42	$ 993.00
ML193UH110XP48C  Furnace-Gas/110Btuh/4T	55W43	$ 990.00
ML193UH110XP60C  Furnace-Gas/110Btuh/5T	55W44	$ 1,094.00
ML193UH135XP60D  Furnace-Gas/135Btuh/5T	55W45	$ 1,136.00
SL280UH070V36A  iC Furn-Gas/70Btuh/3Ton	78W67	$ 1,200.00
SL280UH090V36B  iC Furn-Gas/90Btuh/3Ton	78W69	$ 1,288.00
SL280UH090V48B  iC Furn-Gas/90Btuh/4Ton	78W71	$ 1,356.00
SL280UH090V60C  iC Furn-Gas/90Btuh/5Ton	78W72	$ 1,370.00
SL280UH110V60C  iC Furn-Gas/110Btuh/5Ton	78W74	$ 1,490.00
SL280UH135V60D  iC Furn-Gas/135Btuh/5Ton	78W76	$ 1,716.00
ML180UH045P24A  Furnace/Gas/45Btuh/2Ton	62W68	$ 478.00
ML180UH045P36A  Furnace/Gas/45Btuh/3Ton	62W69	$ 487.00
ML180UH070P24A  Furnace/Gas/70Btuh/2Ton	62W71	$ 516.00
ML180UH070P36A  Furnace/Gas/70Btuh/3Ton	62W73	$ 516.00
ML180UH090P36B  Furnace/Gas/90Btuh/3Ton	62W74	$ 559.00
ML180UH090P48B  Furnace/Gas/90Btuh/4Ton	62W75	$ 538.00
ML180UH110P48C  Furnace/Gas/110Btuh/4Ton	62W78	$ 596.00
ML180UH110P60C  Furnace/Gas/110Btuh/5Ton	62W79	$ 603.00
ML180UH135P60D Furnace/Gas/135Btuh/5Ton	62W81	$ 675.00
SLO185BF79/105V42 LoBoy Front Furn-Oil	11A04	$ 2,017.00
SLO185BR124/141V60 LoBoy Rear Furn-Oil	11A07	$ 2,497.00
SLO185BR79/105V42 LoBoy Rear Furn-Oil	11A06	$ 2,029.00
SLO185UF124/141V60 Upflow Furnace-Oil	11A03	$ 1,947.00
SLO185UF79/105V42 Upflow Furnace-Oil	11A02	$ 1,659.00
ELO183BF101/114P48 LoBoy Front Furn-Oil	89W59	$ 1,394.00
ELO183BF135/150P60 LoBoy Front Furn-Oil	89W60	$ 1,691.00
ELO183BR101/114P48 LoBoy Rear Furn-Oil	89W61	$ 1,498.00
ELO183BR135/150P60 LoBoy Rear Furn-Oil	89W62	$ 1,778.00
ELO183DH101/114P36 Downflow Furnace-Oil	89W63	$ 1,504.00
ELO183DH135/150P60 Downflow Furnace-Oil	89W64	$ 1,738.00
ELO183UF101/114P48 Upflow Furance-Oil	89W57	$ 1,332.00
ELO183UF135/150P60 Upflow Furnace-Oil	89W58	$ 1,496.00
ELO183UF68/86P36 Upflow Furnace-Oil	89W56	$ 1,235.00
SLO185BF124/141V60 loBoy Front Furn-Oil	11A05	$ 2,336.00
SLO185BF79/105V42 LoBoy Front Furn-Oil	11A04	$ 2,017.00
SLO185BR124/141V60 LoBoy Rear Furn-Oil	11A07	$ 2,497.00
SLO185BR79/105V42 LoBoy Rear Furn-Oil	11A06	$ 2,029.00
SLO185UF124/141V60 Upflow Furnace-Oil	11A03	$ 1,947.00
SLO185UF79/105V42 Upflow Furnace-Oil	11A02	$ 1,659.00
Bosch - 50k BTU - Gas Furnace 80% - 14.5"	7738006442	$ 866.00
Bosch - 80k BTU - Gas Furnace 80% - 17.5"	7738006443	$ 960.00
Bosch - 100k BTU - Gas Furnace 80% - 21"	7738006444	$ 1,016.00
Bosch - 120k BTU - Gas Furnace 80% - 24.5"	7738006445	$ 1,059.00
Thermo Pride - Low Profile 85% Highboy Front - 60/72/90,000	OH6FA072D48	$ 1,937.00
Thermo Pride - Low Profile 85.8% Highboy Front - 101/120/132	OH8FA119D60	$ 2,198.00
Therno Pride - 85% Lowboy - 88,000 Output - Rear Flue	OL5-85RDBP	$ 1,949.00
Therno Pride - 85% Lowboy - 88,000 Output - Front Flue	OL5-85FDBP	$ 1,993.00
Thermo Pride - 86.5% Lowboy - 60/72/90,000 Output - Rear Flue	OL6RA072D48	$ 1,872.00
Thermo Pride - 86.5% Lowboy - 60/72/90,000 Output - Front Flue	OL6FA072D48	$ 1,915.00
Thermo Pride - 85% - Lowboy - 104,000 Output - Rear Flue	OL11-105RDBP	$ 2,122.00
Thermo Pride - 85% - Lowboy - 104,000 Output - Front Flue	OL11-105FDBP	$ 2,173.00
Thermo Pride - 85% - Lowboy - 129/142,000 Output - Rear Flue	OL16-125RDBP	$ 2,377.00
Thermo Pride - 85% - Lowboy - 129/142,000 Output - Front Flue	OL16-125FDBP	$ 2,420.00
Thermo Pride - 85% - Lowboy - 153,000 Output - Rear Flue	OL20-151RD	$ 2,673.00
Thermo Pride - 85% - Lowboy - 153,000 Output - Front Flue	OL20-151FD	$ 2,725.00
Thermo Pride - 81.5% - Lowboy - 200,000 Output - Rear Flue	OL33-200R	$ 3,642.00
Thermo Pride - 81.5% - Lowboy - 200,000 Output - Rear Flue	OL33-200F	$ 3,735.00
Thermo Pride - 85.7% - Horizontal/Counterflow - 60/72/90 - Rear	OD6RA072D48	$ 1,972.00
Thermo Pride - 85.7% - Horizontal/Counterflow - 60/72/90 - Front	OD6FA072D48	$ 1,982.00
Thermo Pride - 83% - Horizontal Only - 101,000 - Rear Flue	OT11-105RBP	$ 2,011.00
Thermo Pride - 83% - Horizontal Only - 101,000 - Front Flue	OT11-105FBP	$ 2,011.00
Thermo Pride - 83% - Horizontal Only - 125,000 - Rear Flue	OT16-125RBP	$ 2,265.00
Thermo Pride - 83% - Horizontal Only - 125,000 - Front Flue	OT16-125RBP	$ 2,265.00
Thermo Pride - 85% - Premiere Series Low Profile Highboy 60/72/90	OH6FA072DV4	$ 2,346.00
Thermo Pride - 85.8% - Premiere Series Low Profile Highboy 101/120/132	OH8FA119DV5	$ 2,569.00
Thermo Pride - 86.5% - Premiere Series Low Profile Lowboy 60/72/90 Rear	OL6RA072DV5	$ 2,427.00
Thermo Pride - 86.5% - Premiere Series Low Profile Lowboy 60/72/90 Front	OL6FA072DV5	$ 2,317.00
Thermo Pride - 85% - Premiere Series Lowboy 105,000 - Rear Flue	OL11-105RDBE	$ 2,523.00
Thermo Pride - 85% - Premiere Series Lowboy 105,000 - Front Flue	OL11-105FDBE	$ 2,574.00
Thermo Pride - 85% - Permiere Series Lowboy 125,000 - Rear Flue	OL16-125RDBE	$ 2,856.00
Thermo Pride - 85% - Permiere Series Lowboy 125,000 - Front Flue	OL16-125FDBE	$ 2,901.00
Thermo Pride - 85% - Premiere Series - Lowboy - 153,000 - Rear Flue	OL20-151RDE	$ 3,166.00
Thermo Pride - 85% - Premiere Series - Lowboy - 153,000 - Front Flue	OL20-151FDE	$ 3,250.00
Thermo Pride - 85.7% - Premiere - Horizontal/Counterflow - 60/72/90 - Rear	OD6RA072DV5	$ 2,371.00
Thermo Pride - 85.7% - Premiere - Horizontal/Counterflow - 60/72/90 - Front	OD6FA072DV5	$ 2,385.00
Thermo Pride - 86.4% - Highboy - 2 Stage Riello w/ECM 74/89 high 61/72 low	OH6FX072DV4	$ 2,617.00
Granby - 95.8% - Lowboy Rear Flue Oil Fired Furnace - 77/91 Input 74/87 Output	KLC100	 
Granby - 87.1% - Lowboy ECM Rear Flue Oil Fired Furnace - 77/91/105 Input 66/79/105 Output	KLR100  	$ 1,441.00
Granby - 87.1% - Lowboy ECM Rear Flue Oil Fired Furnace - 77/91/105 Input 66/79/105 Output	KLR100-ECM	$ 1,694.00
Granby - 87.8% - Lowboy Rear Flue Oil Fired Furnace - 119/147/161 Input 102/126/139 Output	KLR200	$ 1,554.00
Granby - 87.8% - Lowboy ECM Rear Flue Oil Fired Furnace - 119/147/161 Input 102/126/139 Output	KLR200-ECM	$ 1,834.00
Granby - 87.1% - Lowboy Front Flue Oil Fired Furnace - 77/91/105 - 66/79/105	KLF100	$ 1,500.00
Granby - 87.1% - Lowboy ECM Front Flue Oil Fired Furnace - 77/91/105 - 66/79/105	KLF200-ECM	$ 1,752.00
Granby - 87.8% - Lowboy Front Flue Oil Fired Furnace - 105/119/140/154 - 93/102/119/132	KLF200  	$ 1,584.00
Granby - 87.8% - Lowboy ECM Front Flue Oil Fired Furnace - 105/119/140/154 - 93/102/119/132	KLF200-ECM	$ 1,893.00
Granby - 86.9% - High Boy/Multi Position - Front Flue - Oil Fired Furnace - 77/91/105 - 66/79/91	KHM100	$ 1,500.00
Granby - 86.9% - High Boy/Multi Position - ECM - Front Flue - Oil Fired Furnace - 77/91/105 - 66/79/91	KHM100-ECM	$ 1,752.00
Granby - 87.5% - High Boy/Multi Position - Front Flue - Oil Fired Furnace - 119/147/161 - 102/126/139	KHM200	$ 1,584.00
Granby - 87.5% - High Boy/Multi Position - ECM - Front Flue - Oil Fired Furnace - 119/147/161 - 102/126/139	KHM200-ECM	$ 1,893.00
*/

export default data;
