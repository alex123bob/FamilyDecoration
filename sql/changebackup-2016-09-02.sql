-- 需求变更， 只有出入帐中的账单需要置为已付

-- 恢复：
begin;
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'new' where id = '20160706220540031695';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'new' where id = '20160707123518001992';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160707190906055015';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'new' where id = '20160709124756029274';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'new' where id = '20160710190541063270';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'new' where id = '20160711211702051822';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'new' where id = '20160712184324099966';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'new' where id = '20160713191736037887';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'new' where id = '20160714214919031216';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'new' where id = '20160714220149046438';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'new' where id = '20160714220220079478';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'new' where id = '20160715202003012797';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'new' where id = '20160715221505011014';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'new' where id = '20160718204248000078';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160719114325010251';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160719140519024668';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'new' where id = '20160720185053076482';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160721123919051027';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'new' where id = '20160721124558099853';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160721134449038853';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160721142341026021';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'new' where id = '20160722165817009276';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160722220907090242';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160725203144027668';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'new' where id = '20160725204155089144';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'new' where id = '20160728115522021712';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160728211001041196';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'new' where id = '20160729190820038772';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160729195521084386';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'new' where id = '20160731191026077019';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160731201034041546';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160802092035022320';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'rdyck2' where id = '20160802213923041996';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'new' where id = '20160804115209028351';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'new' where id = '20160804131837043595';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160804200932043522';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160804201529088592';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160804201834011419';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'rdyck1' where id = '20160804204634079833';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'rdyck2' where id = '20160804220039098086';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'new' where id = '20160805105935040476';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160805112732068779';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160806213556028254';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'rdyck2' where id = '20160807212244001292';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160807222930082614';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'new' where id = '20160809124655091529';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160809184612073462';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160809184734090556';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160809185108075660';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160809190657095030';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160809191302018565';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160809201508005266';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'new' where id = '20160809205951041952';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160809214647095468';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160810112044058879';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160810154359093547';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160810170755030549';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160810200426009914';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160810200827080020';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160810200932097053';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160810201503035946';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160810211822035550';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'new' where id = '20160811102813010710';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160811105002003027';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160811105504042731';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160811105640085258';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160811110354083553';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160811112037044060';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160811112308031658';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160811112558021531';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160811112903085250';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160811113819096664';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160811114718096735';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160811123834015638';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160811125204051563';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160812055553035881';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160813224929030974';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160814215903016494';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160815221338046062';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160815221917058145';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160815222055074165';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160815222324001884';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160816182830051258';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160816183150076145';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160816183349038889';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160816183550005694';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160817102844013287';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'new' where id = '20160817104836029619';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160817112353000925';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160817143347067269';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160817143625081815';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160817143822002498';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'new' where id = '20160817144200020327';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160818162731059239';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160821100839058258';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160821101259067398';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160821101408000594';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160822152722052471';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160822153317036288';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160822154044052746';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'rdyck2' where id = '20160822204213092578';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'new' where id = '20160822205200051737';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'rdyck4' where id = '20160823113243057567';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160824071640051621';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160824072150018099';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160824072444077199';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160824072819038284';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160824073300033327';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160824073529088860';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160824073759094344';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160824074526048822';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160824075912012494';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160824081209042583';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160824081454069342';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160824081828086855';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160824082014079451';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160824082202033279';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160824082518024643';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160824082751020678';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160824083002003491';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160824115252011875';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160824115905056718';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160824120719046716';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160824120840096287';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160824120853090747';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160824120941023471';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160824121230067163';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'new' where id = '20160824121301044038';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'new' where id = '20160824123442012332';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'new' where id = '20160824125424037456';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160824125625036757';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160824130108037719';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160824130325083969';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160824130522063942';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160824130657067618';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160824130935001813';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'rdyck2' where id = '20160824131250042924';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'new' where id = '20160824131840086862';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'rdyck2' where id = '20160824131849084926';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160824132349031068';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160824132939008371';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160824133253040534';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160824134039076959';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160824135042080483';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160824140040079032';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160824184627055293';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160824184827022362';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'rdyck2' where id = '20160824201951054084';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'new' where id = '20160824202126083853';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'new' where id = '20160824203037030239';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160824211709028341';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160825093015060778';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160825093701027140';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160825093944043978';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160825094309066956';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160825094507070892';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160825094707094720';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160825094928003821';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160825095923066263';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160825100141024653';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160825100308036597';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160825100326075614';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'new' where id = '20160825101623032016';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'rdyck2' where id = '20160825110051047379';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160825112318019611';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160825112639024461';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160825112810002391';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160825113010054815';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160825115026042657';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160825115536036944';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160825115542018375';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160825115815072521';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160825125933067570';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'new' where id = '20160825164352027436';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'new' where id = '20160825170150048520';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160825171904093611';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160825173044064515';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'new' where id = '20160825173531024490';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160825173844008155';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160825174634062974';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160825174939096812';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160825175258045955';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160825180018000657';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160825180456087021';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'chk' where id = '20160826111050093262';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'rdyck4' where id = '20160826142710029151';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'rdyck2' where id = '20160826173302011370';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'rdyck2' where id = '20160826173530045821';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'new' where id = '20160826215336016353';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'rdyck4' where id = '20160827140950063838';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'rdyck4' where id = '20160827141151074278';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'rdyck4' where id = '20160827152421004652';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'rdyck4' where id = '20160827153044073428';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'rdyck2' where id = '20160827200947019812';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'rdyck2' where id = '20160828141002065731';
update statement_bill set paidTime = null,paidAmount = null ,descpt = '', payer = '',status = 'rdyck3' where id = '20160830104154096620';
commit;

-- 需要修改的数据备份：
-- SELECT * FROM  `statement_bill` WHERE (billType =  'reg'OR billType =  'ppd')AND isDeleted =  'false' AND STATUS =  'chk' LIMIT 0 , 330
-- 以下是查询出来的备份数据：
INSERT INTO `statement_bill` (`id`, `payee`, `projectId`, `projectName`, `totalFee`, `claimAmount`, `payedTimes`, `projectProgress`, `createTime`, `updateTime`, `isDeleted`, `phoneNumber`, `professionType`, `billName`, `billValue`, `billType`, `status`, `checker`, `creator`, `supplierId`, `payer`, `paidAmount`, `paidTime`, `reimbursementReason`, `descpt`, `deadline`, `certs`, `businessId`, `refId`) VALUES
('20160707190906055015', '何金干', '201603021720448195', '旺庄 2-306', 1862, 1862, 1, 100, '2016-07-07 19:09:06', '2016-08-26 09:31:52', 'false', '15857250974', '0001', '何金干领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0009', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160719114325010251', '陈辉', '201604111742005704', '金都阳光 3-103', 4048.25, 3600, 2, 100, '2016-07-19 11:43:25', '2016-08-21 09:04:22', 'false', '18862839318', '0001', '陈辉领款单', NULL, 'reg', 'chk', 'williamzhang', 'gc0012', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160719140519024668', '陈逢喜', '201605261139528526', '德信·上城 8-204', 2872, 2600, 2, 100, '2016-07-19 14:05:19', '2016-08-10 15:56:14', 'false', '15655627616', '0001', '陈逢喜领款单', NULL, 'reg', 'chk', 'williamzhang', 'gc0006', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160721123919051027', '李景霞', '201605261121145249', '德信·上城 2-1203', 200, 200, 1, 100, '2016-07-21 12:39:19', '2016-07-30 11:22:14', 'false', '13816016254', '0009', '李景霞领款单', NULL, 'reg', 'chk', 'williamzhang', 'gc0010', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160721134449038853', '何金干', '201604111740088904', '回龙花园 1-2-303', 3862.35, 3500, 1, 100, '2016-07-21 13:44:49', '2016-08-19 17:14:54', 'false', '15857250974', '0001', '何金干领款单', NULL, 'reg', 'chk', 'williamzhang', 'gc0012', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160721142341026021', '李景霞', '201605261148108218', '金都 9-104', 350, 350, 1, 100, '2016-07-21 14:23:41', '2016-07-30 11:22:03', 'false', '13816016254', '0009', '李景霞领款单', NULL, 'reg', 'chk', 'williamzhang', 'gc0010', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160722220907090242', '陈其训', '201512011357103818', '德信·上城 3-1204', 2745, 2745, 1, 100, '2016-07-22 22:09:07', '2016-08-26 09:30:02', 'false', '13819278694', '0001', '陈其训领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0007', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160725203144027668', '张安平', '201603021706156514', '旺庄 2幢604', 1412, 1412, 2, 100, '2016-07-25 20:31:44', '2016-07-26 16:49:16', 'false', '15868242082', '0004', '张安平领款单', NULL, 'reg', 'chk', 'williamzhang', 'gc0009', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160728211001041196', '贾先伢', '201512301626411755', '德信·上城 4#601', 1101.6, 1101.6, 1, 100, '2016-07-28 21:10:01', '2016-08-05 13:25:12', 'false', '13625823181', '0001', '贾先伢领款单', NULL, 'reg', 'chk', 'williamzhang', 'gc0009', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160729195521084386', '金常开', '201511031506326164', '德信·上城 9-601', 2085.8, 2085, 2, 100, '2016-07-29 19:55:21', '2016-08-04 19:43:00', 'false', '18325630898', '0002', '金常开领款单', NULL, 'reg', 'chk', 'williamzhang', 'gc0005', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160731201034041546', '林三茂', '201604111740088904', '回龙花园 1-2-303', 1208, 1208, 1, 100, '2016-07-31 20:10:34', '2016-08-25 16:26:22', 'false', '18069713989', '0005', '林三茂领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0012', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160802092035022320', '杨旭慧', '201512230948443818', '百合公寓 馨兰苑1-601', 150, 150, 1, 0, '2016-08-02 09:20:35', '2016-08-02 09:54:21', 'false', '13706823528', '0009', '杨旭慧领款单', NULL, 'reg', 'chk', 'williamzhang', 'gc0005', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160804200932043522', '余永红', '201605261137536910', '德信·上城 10-805', 2500, 2500, 1, 90, '2016-08-04 20:09:32', '2016-08-05 13:25:36', 'false', '15005594876', '0001', '余永红领款单', NULL, 'ppd', 'chk', 'williamzhang', 'gc0009', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160804201529088592', '余永红', '201602291705454522', '金都阳光 竹苑居3-101', 2500, 2500, 1, 90, '2016-08-04 20:15:29', '2016-08-05 13:25:28', 'false', '15005594876', '0001', '余永红领款单', NULL, 'ppd', 'chk', 'williamzhang', 'gc0009', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160804201834011419', '余永红', '201601071637216586', '德信·上城 10-1808', 2500, 2500, 1, 90, '2016-08-04 20:18:34', '2016-08-05 13:25:20', 'false', '15005594876', '0001', '余永红领款单', NULL, 'ppd', 'chk', 'williamzhang', 'gc0009', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160805112732068779', '汪方宝', '201605250946221717', '保利原乡 30-2401', 4000, 4000, 1, 100, '2016-08-05 11:27:32', '2016-08-05 13:27:07', 'false', '15212909860', '0002', '汪方宝领款单', NULL, 'ppd', 'chk', 'williamzhang', 'gc0005', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160806213556028254', '余秋明', '201607241524463666', '一里洋房 22-303', 1286.4, 1286, 1, 100, '2016-08-06 21:35:56', '2016-08-19 17:15:02', 'false', '13136534512', '0001', '余秋明领款单', NULL, 'reg', 'chk', NULL, 'gc0007', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160807222930082614', '汪念材', '201512011357103818', '德信·上城 3-1204', 4960, 3560, 1, 85, '2016-08-07 22:29:30', '2016-08-19 17:16:06', 'false', '13375722389', '0004', '汪念材领款单', NULL, 'reg', 'chk', NULL, 'gc0007', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160809184612073462', '曹佰桃', '201604111740088904', '回龙花园 1-2-303', 6000, 6000, 1, 90, '2016-08-09 18:46:12', '2016-08-10 15:17:50', 'false', '13757283016', '0003', '曹佰桃领款单', NULL, 'ppd', 'chk', 'williamzhang', 'gc0012', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160809184734090556', '曹佰桃', '201604221456481154', '英溪桃源 1幢504', 3000, 3000, 1, 70, '2016-08-09 18:47:34', '2016-08-10 15:17:59', 'false', '13757283016', '0003', '曹佰桃领款单', NULL, 'ppd', 'chk', 'williamzhang', 'gc0012', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160809185108075660', '郭潇', '201511281736301533', '英溪桃源 2-1301', 7000, 7000, 1, 100, '2016-08-09 18:51:08', '2016-08-19 17:14:28', 'false', '13587204770', '0001', '郭潇领款单', NULL, 'ppd', 'chk', NULL, 'gc0012', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160809190657095030', '林三茂', '201604221456481154', '英溪桃源 1幢504', 818, 818, 1, 100, '2016-08-09 19:06:57', '2016-08-25 16:26:34', 'false', '18069713989', '0005', '林三茂领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0012', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160809191302018565', '林三茂', '201604111742005704', '金都阳光 3-103', 870, 870, 1, 100, '2016-08-09 19:13:02', '2016-08-25 16:26:28', 'false', '18069713989', '0005', '林三茂领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0012', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160809201508005266', '徐茂生', '201512011657417070', '德信·上城 4-404', 9050, 1850, 3, 100, '2016-08-09 20:15:08', '2016-08-26 09:38:41', 'false', '15268208304', '0003', '徐茂生领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0007', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160809214647095468', '陈结红', '201602261714097152', '德信·上城 4-1404', 4000, 4000, 1, 85, '2016-08-09 21:46:47', '2016-08-19 17:14:44', 'false', '1358729441', '0001', '陈结红领款单', NULL, 'ppd', 'chk', NULL, 'gc0007', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160810112044058879', '姚新武', '201603181644419173', '幸福村 自建房', 1487, 1487, 1, 100, '2016-08-10 11:20:44', '2016-08-10 15:17:39', 'false', '15857210231', '0005', '姚新武领款单', NULL, 'reg', 'chk', 'williamzhang', 'gc0011', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160810154359093547', '熊英', '201603191126149582', '五龙嘉苑 92-1-401', 308.1, 308, 1, 100, '2016-08-10 15:43:59', '2016-08-19 17:17:25', 'false', '15067238360', '0009', '熊英领款单', NULL, 'reg', 'chk', NULL, 'gc0010', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160810170755030549', '彭炳焰', '201604111740088904', '回龙花园 1-2-303', 300, 300, 1, 100, '2016-08-10 17:07:55', '2016-08-19 17:17:38', 'false', '15257245010', '0005', '彭炳焰领款单', NULL, 'reg', 'chk', NULL, 'gc0012', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160810200426009914', '彭炳焰', '201511281736301533', '英溪桃源 2-1301', 450, 450, 1, 100, '2016-08-10 20:04:26', '2016-08-19 17:16:21', 'false', '15257245010', '0005', '彭炳焰领款单', NULL, 'reg', 'chk', NULL, 'gc0012', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160810200827080020', '彭炳焰', '201604111742005704', '金都阳光 3-103', 600, 600, 1, 100, '2016-08-10 20:08:27', '2016-08-19 17:17:45', 'false', '15257245010', '0005', '彭炳焰领款单', NULL, 'reg', 'chk', NULL, 'gc0012', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160810200932097053', '彭炳焰', '201604221456481154', '英溪桃源 1幢504', 300, 300, 1, 100, '2016-08-10 20:09:32', '2016-08-19 17:17:52', 'false', '15257245010', '0005', '彭炳焰领款单', NULL, 'reg', 'chk', NULL, 'gc0012', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160810201503035946', '彭炳焰', '201605021035318059', '都市桃源21-102 杨', 450, 450, 1, 80, '2016-08-10 20:15:03', '2016-08-19 17:17:59', 'false', '15257245010', '0005', '彭炳焰领款单', NULL, 'reg', 'chk', NULL, 'gc0012', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160810211822035550', '方结楼', '201511281729292808', '德信·上城 11-703', 4359.4, 1359, 2, 100, '2016-08-10 21:18:22', '2016-08-26 09:28:39', 'false', '15957201757', '0001', '方结楼领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0007', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160811105002003027', '徐定发', '201607151003427814', '武康镇 能力风暴', 450, 450, 1, 100, '2016-08-11 10:50:02', '2016-08-19 17:17:04', 'false', '18768289996', '0005', '徐定发领款单', NULL, 'reg', 'chk', NULL, 'gc0003', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160811105504042731', '徐定发', '201607151004432193', '武康镇 莫外卫生间装修', 300, 300, 1, 100, '2016-08-11 10:55:04', '2016-08-19 17:16:49', 'false', '18768289996', '0005', '徐定发领款单', NULL, 'reg', 'chk', NULL, 'gc0003', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160811105640085258', '徐定发', '201607120957453288', '德清县 乡村大院', 4425, 4425, 1, 100, '2016-08-11 10:56:40', '2016-08-19 17:17:18', 'false', '18768289996', '0005', '徐定发领款单', NULL, 'reg', 'chk', NULL, 'gc0003', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160811110354083553', '谭传有', '201607120957453288', '德清县 乡村大院', 9000, 9000, 1, 1, '2016-08-11 11:03:54', '2016-08-19 17:17:11', 'false', '13515829160', '0005', '谭传有领款单', NULL, 'reg', 'chk', NULL, 'gc0003', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160811112037044060', '沈伟', '201509091720207619', '保利原乡 20-604，胡文洁', 5000, 5000, 1, 90, '2016-08-11 11:20:37', '2016-08-19 17:15:46', 'false', '15088325271', '0003', '沈伟领款单', NULL, 'ppd', 'chk', NULL, 'gc0002', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160811112308031658', '沈伟', '201508151654507618', '格兰维亚 4--102', 10000, 10000, 1, 60, '2016-08-11 11:23:08', '2016-08-19 17:15:38', 'false', '15088325271', '0003', '沈伟领款单', NULL, 'ppd', 'chk', NULL, 'gc0002', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160811112558021531', '方淼节', '201512111155388111', '庾村别墅 庾村别墅群', 10000, 10000, 1, 80, '2016-08-11 11:25:58', '2016-08-19 17:14:38', 'false', '15257245977', '0001', '方淼节领款单', NULL, 'ppd', 'chk', NULL, 'gc0002', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160811112903085250', '汪奎', '201604021015115758', '金都阳光 清泉居65-104', 5000, 5000, 2, 95, '2016-08-11 11:29:03', '2016-08-19 17:15:30', 'false', '15705828359', '0002', '汪奎领款单', NULL, 'ppd', 'chk', NULL, 'gc0002', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160811113819096664', '曹德胜', '201510081806223295', '格兰维亚 51-104', 5000, 5000, 3, 95, '2016-08-11 11:38:19', '2016-08-19 17:15:09', 'false', '13735110582', '0002', '曹德胜领款单', NULL, 'ppd', 'chk', NULL, 'gc0002', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160811114718096735', '余习海', '201510081806223295', '格兰维亚 51-104', 6000, 6000, 2, 80, '2016-08-11 11:47:18', '2016-08-19 17:15:53', 'false', '13587908732', '0003', '余习海领款单', NULL, 'ppd', 'chk', NULL, 'gc0002', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160811123834015638', '杨国民', '201603181644419173', '幸福村 自建房', 3844, 3200, 2, 100, '2016-08-11 12:38:34', '2016-08-19 17:16:14', 'false', '13706824685', '0004', '杨国民领款单', NULL, 'reg', 'chk', NULL, 'gc0011', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160811125204051563', '曹北桃', '201603181644419173', '幸福村 自建房', 21590, 10510, 2, 100, '2016-08-11 12:52:04', '2016-08-19 17:15:59', 'false', '13757283016', '0003', '曹北桃领款单', NULL, 'reg', 'chk', NULL, 'gc0011', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160812055553035881', '李彪', '201605051937106171', '金都阳光 清泉居52-101', 3000, 3000, 1, 70, '2016-08-12 05:55:53', '2016-08-26 09:38:58', 'false', '13819282052', '0003', '李彪领款单', NULL, 'ppd', 'chk', 'Cw0001', 'gc0010', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160813224929030974', '檀淼来', '201512011357103818', '德信·上城 3-1204', 6909.6, 2709, 2, 100, '2016-08-13 22:49:29', '2016-08-27 12:40:34', 'false', '15868481717', '0001', '檀淼来领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0007', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160814215903016494', '徐西明', '201512011357103818', '德信·上城 3-1204', 5000, 5000, 1, 100, '2016-08-14 21:59:03', '2016-08-19 17:15:16', 'false', '13816016254', '0002', '徐西明领款单', NULL, 'ppd', 'chk', NULL, 'gc0007', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160815221338046062', '李井霞', '201602261714097152', '德信·上城 4-1404', 200, 200, 1, 100, '2016-08-15 22:13:38', '2016-08-19 17:16:57', 'false', '15088323394', '0009', '李井霞领款单', NULL, 'reg', 'chk', NULL, 'gc0007', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160815221917058145', '李井霞', '201607221532165929', '美都御府 1-803', 200, 200, 1, 100, '2016-08-15 22:19:17', '2016-08-19 17:16:33', 'false', '15088323394', '0009', '李井霞领款单', NULL, 'reg', 'chk', NULL, 'gc0007', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160815222055074165', '李井霞', '201607241524463666', '一里洋房 22-303', 200, 200, 1, 100, '2016-08-15 22:20:55', '2016-08-19 17:16:39', 'false', '15088323394', '0009', '李井霞领款单', NULL, 'reg', 'chk', NULL, 'gc0007', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160815222324001884', '吴文彬', '201512011658547142', '德信·上城 4-1604', 5000, 5000, 1, 100, '2016-08-15 22:23:24', '2016-08-19 17:15:23', 'false', '13252093993', '0002', '吴文彬领款单', NULL, 'ppd', 'chk', NULL, 'gc0007', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160816182830051258', '徐游', '201605081224041022', '溪山美墅 29-102', 8000, 8000, 1, 80, '2016-08-16 18:28:30', '2016-08-26 09:37:09', 'false', '18671369938', '0002', '徐游领款单', NULL, 'ppd', 'chk', 'Cw0001', 'gc0012', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160816183150076145', '曹美顺', '201605081224041022', '溪山美墅 29-102', 5000, 5000, 1, 70, '2016-08-16 18:31:50', '2016-08-25 16:26:00', 'false', '18458271279', '0001', '曹美顺领款单', NULL, 'ppd', 'chk', 'Cw0001', 'gc0012', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160816183349038889', '童建强', '201605021035318059', '都市桃源21-102 杨', 8000, 8000, 1, 90, '2016-08-16 18:33:49', '2016-08-25 16:25:52', 'false', '13750838321', '0001', '童建强领款单', NULL, 'ppd', 'chk', 'Cw0001', 'gc0012', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160816183550005694', '卢长结', '201607071203419896', '溪山美墅 19-104', 3000, 3000, 1, 40, '2016-08-16 18:35:50', '2016-08-26 09:35:56', 'false', '13735112976', '0001', '卢长结领款单', NULL, 'ppd', 'chk', 'Cw0001', 'gc0012', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160817102844013287', ' 陈忠兴', '201605250936079500', '美都御府 1-1008', 5162.2, 4962, 1, 100, '2016-08-17 10:28:44', '2016-08-25 16:26:09', 'false', '13615820135', '0002', ' 陈忠兴领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0006', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160817112353000925', '曹结华', '201604021304287805', '德信·上城 9-901', 7150, 7150, 1, 100, '2016-08-17 11:23:53', '2016-08-27 12:37:05', 'false', '13819274101', '0003', '曹结华领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0005', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160817143347067269', '宁双宽', '201607100947057714', '德信·上城 10幢1703', 4000, 4000, 1, 90, '2016-08-17 14:33:47', '2016-08-26 09:36:04', 'false', '15268230882', '0001', '宁双宽领款单', NULL, 'ppd', 'chk', 'Cw0001', 'gc0013', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160817143625081815', '林小结', '201607100947057714', '德信·上城 10幢1703', 3000, 3000, 1, 95, '2016-08-17 14:36:25', '2016-08-26 09:37:47', 'false', '13515827663', '0002', '林小结领款单', NULL, 'ppd', 'chk', 'Cw0001', 'gc0013', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160817143822002498', '段文雪', '201607131524477790', '金桂花园 6-801', 4000, 2800, 1, 95, '2016-08-17 14:38:22', '2016-08-27 08:45:36', 'false', '15555792068', '0004', '段文雪领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0013', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160818162731059239', '彭结松', '201605251006269608', '一里洋房 3-102', 10000, 10000, 1, 95, '2016-08-18 16:27:31', '2016-08-26 09:35:33', 'false', '13706820673', '0001', '彭结松领款单', NULL, 'ppd', 'chk', 'Cw0001', 'gc0005', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160821100839058258', '陆圣阳', '201607120957453288', '德清县 乡村大院', 10000, 10000, 2, 95, '2016-08-21 10:08:39', '2016-08-25 16:25:45', 'false', '15268213226', '0004', '陆圣阳领款单', NULL, 'ppd', 'chk', 'Cw0001', 'gc0003', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160821101259067398', '彭东宁', '201607120957453288', '德清县 乡村大院', 10000, 10000, 3, 95, '2016-08-21 10:12:59', '2016-08-25 16:25:25', 'false', '15336988162', '0002', '彭东宁领款单', NULL, 'ppd', 'chk', 'Cw0001', 'gc0003', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160821101408000594', '张立明', '201607151003427814', '武康镇 能力风暴', 10000, 10000, 2, 95, '2016-08-21 10:14:08', '2016-08-25 16:25:36', 'false', '15088381585', '0002', '张立明领款单', NULL, 'ppd', 'chk', 'Cw0001', 'gc0003', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160822152722052471', '曹林宽', '201605261150119779', '德信·上城 10-707', 4000, 4000, 1, 95, '2016-08-22 15:27:22', '2016-08-26 09:35:40', 'false', '18357290585', '0001', '曹林宽领款单', NULL, 'ppd', 'chk', 'Cw0001', 'gc0010', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160822153317036288', '曹林宽', '201605051938363921', '奥体壹号 3-1408', 2500, 2500, 1, 90, '2016-08-22 15:33:17', '2016-08-26 09:33:37', 'false', '18357290585', '0001', '曹林宽领款单', NULL, 'ppd', 'chk', 'Cw0001', 'gc0010', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160822154044052746', '胡海南', '201605051938363921', '奥体壹号 3-1408', 4500, 4500, 1, 95, '2016-08-22 15:40:44', '2016-08-26 09:36:38', 'false', '13059936107', '0002', '胡海南领款单', NULL, 'ppd', 'chk', 'Cw0001', 'gc0010', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160824071640051621', '许有亮', '201511211905209055', '美都御府 8-2-1204', 150, 150, 1, 100, '2016-08-24 07:16:40', '2016-08-26 09:45:53', 'false', '18656693129', '0009', '许有亮领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0005', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160824072150018099', '许有亮', '201511071045032895', '德信·上城 2-1603', 150, 150, 1, 100, '2016-08-24 07:21:50', '2016-08-26 09:45:41', 'false', '18656693129', '0009', '许有亮领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0005', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160824072444077199', '许有亮', '201511071045032895', '德信·上城 2-1603', 75, 75, 1, 100, '2016-08-24 07:24:44', '2016-08-26 09:45:47', 'false', '18656693129', '0009', '许有亮领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0005', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160824072819038284', '许有亮', '201604081442166893', '德信·上城 5-1201', 150, 150, 1, 100, '2016-08-24 07:28:19', '2016-08-27 08:45:47', 'false', '18656693129', '0009', '许有亮领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0005', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160824073300033327', '许有亮', '201512230948443818', '百合公寓 馨兰苑1-601', 150, 150, 1, 100, '2016-08-24 07:33:00', '2016-08-26 11:30:44', 'false', '18656693129', '0009', '许有亮领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0005', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160824073529088860', '许有亮', '201605250946221717', '保利原乡 30-2401', 150, 150, 1, 100, '2016-08-24 07:35:29', '2016-08-27 08:46:15', 'false', '18656693129', '0009', '许有亮领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0005', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160824073759094344', '许有亮', '201608171158355322', '上城 8-1601', 150, 150, 1, 100, '2016-08-24 07:37:59', '2016-08-27 08:46:48', 'false', '18656693129', '0009', '许有亮领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0005', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160824074526048822', '许有亮', '201511211905209055', '美都御府 8-2-1204', 150, 150, 1, 100, '2016-08-24 07:45:26', '2016-08-26 11:30:27', 'false', '18656693129', '0009', '许有亮领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0005', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160824075912012494', '许有亮', '201608171158355322', '上城 8-1601', 150, 150, 1, 100, '2016-08-24 07:59:12', '2016-08-26 10:02:05', 'false', '18656693129', '0009', '许有亮领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0005', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160824081209042583', '许有亮', '201603030912379853', '德信·上城 9幢604平层', 150, 150, 1, 100, '2016-08-24 08:12:09', '2016-08-26 11:30:49', 'false', '18656693129', '0009', '许有亮领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0005', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160824081454069342', '许有亮', '201606241738105582', '美都御府 2-2404', 150, 150, 1, 100, '2016-08-24 08:14:54', '2016-08-27 08:46:30', 'false', '18656693129', '0009', '许有亮领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0005', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160824081828086855', '许有亮', '201604021304287805', '德信·上城 9-901', 150, 150, 1, 100, '2016-08-24 08:18:28', '2016-08-26 11:30:55', 'false', '18656693129', '0009', '许有亮领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0005', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160824082014079451', '许有亮', '201511211910297541', '御景公馆 3-701', 150, 150, 1, 100, '2016-08-24 08:20:14', '2016-08-26 11:30:33', 'false', '18656693129', '0009', '许有亮领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0005', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160824082202033279', '许有亮', '201510010855191314', '御景公馆 1-1104室', 150, 150, 1, 100, '2016-08-24 08:22:02', '2016-08-26 09:45:36', 'false', '18656693129', '0009', '许有亮领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0005', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160824082518024643', '许有亮', '201608151003398829', '美都御府 1-2203', 150, 150, 1, 100, '2016-08-24 08:25:18', '2016-08-27 08:46:39', 'false', '18656693129', '0009', '许有亮领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0005', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160824082751020678', '许有亮', '201604271329251551', '上城 9-603', 150, 150, 1, 100, '2016-08-24 08:27:51', '2016-08-27 08:46:09', 'false', '18656693129', '0009', '许有亮领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0005', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160824083002003491', '许有亮', '201605251006269608', '一里洋房 3-102', 150, 150, 1, 150, '2016-08-24 08:30:02', '2016-08-27 08:46:23', 'false', '18656693129', '0009', '许有亮领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0005', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160824115252011875', '汪奎', '201603301554562763', '德信·上城 3-303', 5000, 5000, 1, 95, '2016-08-24 11:52:52', '2016-08-26 09:36:22', 'false', '15705828359', '0002', '汪奎领款单', NULL, 'ppd', 'chk', 'Cw0001', 'gc0010', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160824115905056718', '陈结松', '201605051942437023', '上城 6-1004', 4000, 4000, 1, 90, '2016-08-24 11:59:05', '2016-08-26 09:35:18', 'false', '18757269450', '0001', '陈结松领款单', NULL, 'ppd', 'chk', 'Cw0001', 'gc0010', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160824120719046716', '严建', '201605051937106171', '金都阳光 清泉居52-101', 150, 150, 1, 100, '2016-08-24 12:07:19', '2016-08-26 09:43:53', 'false', '13757211749', '0005', '严建领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0010', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160824120840096287', '严建', '201605261148108218', '金都 9-104', 150, 150, 1, 100, '2016-08-24 12:08:40', '2016-08-26 09:44:48', 'false', '13757211749', '0005', '严建领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0010', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160824120853090747', '黄其春', '201604021304287805', '德信·上城 9-901', 626.5, 626.5, 1, 100, '2016-08-24 12:08:53', '2016-08-26 09:43:33', 'false', '15067263806', '0005', '黄其春领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0005', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160824120941023471', '严建', '201603301554562763', '德信·上城 3-303', 150, 150, 1, 100, '2016-08-24 12:09:41', '2016-08-26 09:43:19', 'false', '13757211749', '0005', '严建领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0010', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160824121230067163', '严建', '201605261150119779', '德信·上城 10-707', 225, 225, 1, 100, '2016-08-24 12:12:30', '2016-08-26 09:44:54', 'false', '13757211749', '0005', '严建领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0010', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160824125625036757', '许有亮', '201603161612482939', '德信·上城 10-2406', 150, 150, 1, 100, '2016-08-24 12:56:25', '2016-08-26 09:43:12', 'false', '18656693129', '0005', '许有亮领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0006', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160824130108037719', '许有亮', '201605250936079500', '美都御府 1-1008', 150, 150, 1, 100, '2016-08-24 13:01:08', '2016-08-26 09:44:15', 'false', '18656693129', '0005', '许有亮领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0006', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160824130325083969', '许有亮', '201605261139528526', '德信·上城 8-204', 150, 150, 1, 100, '2016-08-24 13:03:25', '2016-08-26 09:44:26', 'false', '18656693129', '0005', '许有亮领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0006', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160824130522063942', '许有亮', '201604020926215701', '德信·上城 3-1601', 150, 150, 1, 100, '2016-08-24 13:05:22', '2016-08-26 09:43:25', 'false', '18656693129', '0005', '许有亮领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0006', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160824130657067618', '许有亮', '201605261142101169', '保利原乡 17-1601', 150, 150, 1, 100, '2016-08-24 13:06:57', '2016-08-26 09:44:33', 'false', '18656693129', '0005', '许有亮领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0006', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160824130935001813', '许有亮', '201606031106342204', '美都御府 二期1-407', 150, 150, 1, 100, '2016-08-24 13:09:35', '2016-08-26 09:45:00', 'false', '18656693129', '0005', '许有亮领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0006', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160824132349031068', '徐贤伢', '201604111742005704', '金都阳光 3-103', 4000, 4000, 1, 95, '2016-08-24 13:23:49', '2016-08-26 09:38:51', 'false', '17730377072', '0003', '徐贤伢领款单', NULL, 'ppd', 'chk', 'Cw0001', 'gc0012', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160824132939008371', '黄杰', '201606271254574257', '英溪桃源 1-2-403', 693.75, 690, 1, 100, '2016-08-24 13:29:39', '2016-08-26 09:45:07', 'false', '18057217312', '0005', '黄杰领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0006', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160824133253040534', '黄杰', '201607091529088657', '美都御府 4-803', 1000, 1000, 1, 100, '2016-08-24 13:32:53', '2016-08-26 09:45:12', 'false', '18057217312', '0005', '黄杰领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0006', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160824134039076959', '黄杰', '201605261142101169', '保利原乡 17-1601', 1697, 1695, 1, 100, '2016-08-24 13:40:39', '2016-08-26 09:44:43', 'false', '18057217312', '0005', '黄杰领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0006', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160824135042080483', '黄杰', '201605121039503418', '德信·上城 1-1004', 1990, 1990, 1, 100, '2016-08-24 13:50:42', '2016-08-26 09:44:04', 'false', '18057217312', '0005', '黄杰领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0006', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160824140040079032', '黄杰', '201604020928137966', '德信·上城 9-1802', 150, 150, 1, 100, '2016-08-24 14:00:40', '2016-08-26 09:43:47', 'false', '18057217312', '0005', '黄杰领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0006', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160824184627055293', '汪生福', '201605261150119779', '德信·上城 10-707', 4000, 4000, 1, 90, '2016-08-24 18:46:27', '2016-08-26 09:42:51', 'false', '13252092919', '0003', '汪生福领款单', NULL, 'ppd', 'chk', 'Cw0001', 'gc0010', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160824184827022362', '李彪', '201605051937106171', '金都阳光 清泉居52-101', 5000, 5000, 2, 90, '2016-08-24 18:48:27', '2016-08-26 09:39:05', 'false', '13819252052', '0003', '李彪领款单', NULL, 'ppd', 'chk', 'Cw0001', 'gc0010', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160824211709028341', '汪生福', '201512101423087427', '金都阳光 清泉居61-104', 5000, 5000, 3, 1000, '2016-08-24 21:17:09', '2016-08-27 08:49:30', 'false', '13252092919', '0003', '汪生福领款单', NULL, 'ppd', 'chk', 'Cw0001', 'gc0007', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160825093015060778', '曾德建', '201511031214048335', '华盛达山庄22幢', 10000, 10000, 3, 95, '2016-08-25 09:30:15', '2016-08-27 12:36:44', 'false', '15067237148', '0001', '曾德建领款单', NULL, 'ppd', 'chk', 'Cw0001', 'gc0002', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160825093701027140', '曾德建', '201511211908352319', '溪山美墅 52-101', 5000, 5000, 2, 90, '2016-08-25 09:37:01', '2016-08-27 12:36:51', 'false', '15067237148', '0001', '曾德建领款单', NULL, 'ppd', 'chk', 'Cw0001', 'gc0002', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160825093944043978', '朱兴贵', '201512101422277185', '狮山国际 10幢106', 6000, 6000, 3, 95, '2016-08-25 09:39:44', '2016-08-26 09:30:37', 'false', '15868223607', '0001', '朱兴贵领款单', NULL, 'ppd', 'chk', 'Cw0001', 'gc0002', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160825094309066956', '陈文斌', '201604201709551861', '旺庄 4-202', 5000, 5000, 1, 90, '2016-08-25 09:43:09', '2016-08-26 09:32:56', 'false', '15857210810', '0001', '陈文斌领款单', NULL, 'ppd', 'chk', 'Cw0001', 'gc0002', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160825094507070892', '陈炳竹', '201604201709551861', '旺庄 4-202', 3000, 3000, 1, 90, '2016-08-25 09:45:07', '2016-08-26 09:36:31', 'false', '13957278691', '0002', '陈炳竹领款单', NULL, 'ppd', 'chk', 'Cw0001', 'gc0002', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160825094707094720', '许海斌', '201604201709551861', '旺庄 4-202', 3000, 3000, 1, 95, '2016-08-25 09:47:07', '2016-08-26 09:42:57', 'false', '13059917128', '0004', '许海斌领款单', NULL, 'ppd', 'chk', 'Cw0001', 'gc0002', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160825094928003821', '吴文洲', '201604021015115758', '金都阳光 清泉居65-104', 6000, 6000, 1, 90, '2016-08-25 09:49:28', '2016-08-26 09:32:15', 'false', '15349818375', '0001', '吴文洲领款单', NULL, 'ppd', 'chk', 'Cw0001', 'gc0002', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160825095923066263', '甘万俊', '201512101424128774', '德信·上城 3-401', 7000, 7000, 1, 100, '2016-08-25 09:59:23', '2016-08-26 09:31:15', 'false', '13252028728', '0001', '甘万俊领款单', NULL, 'ppd', 'chk', 'Cw0001', 'gc0006', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160825100141024653', '陈逢喜', '201606271254574257', '英溪桃源 1-2-403', 3000, 3000, 1, 100, '2016-08-25 10:01:41', '2016-08-26 09:35:49', 'false', '15655627616', '0001', '陈逢喜领款单', NULL, 'ppd', 'chk', 'Cw0001', 'gc0006', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160825100308036597', '杨万平', '201607131524477790', '金桂花园 6-801', 2000, 2000, 1, 70, '2016-08-25 10:03:08', '2016-08-26 09:36:11', 'false', '18297588940', '0001', '杨万平领款单', NULL, 'ppd', 'chk', 'Cw0001', 'gc0013', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160825100326075614', '陈逢喜', '201605121039503418', '德信·上城 1-1004', 7000, 7000, 1, 100, '2016-08-25 10:03:26', '2016-08-26 09:35:26', 'false', '15655627616', '0001', '陈逢喜领款单', NULL, 'ppd', 'chk', 'Cw0001', 'gc0006', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160825112318019611', '许有亮', '201605212014084537', '德信·上城 8-2203', 225, 225, 1, 100, '2016-08-25 11:23:18', '2016-08-26 09:44:09', 'false', '18656693129', '0005', '许有亮领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0013', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160825112639024461', '许有亮', '201605251013231571', '保利原乡 22-2804', 225, 225, 1, 100, '2016-08-25 11:26:39', '2016-08-26 09:44:21', 'false', '18656693129', '0005', '许有亮领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0013', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160825112810002391', '许有亮', '201607100947057714', '德信·上城 10幢1703', 150, 150, 1, 100, '2016-08-25 11:28:10', '2016-08-26 09:45:18', 'false', '18656693129', '0005', '许有亮领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0013', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160825113010054815', '许有亮', '201607131524477790', '金桂花园 6-801', 150, 150, 1, 100, '2016-08-25 11:30:10', '2016-08-26 09:45:24', 'false', '18656693129', '0005', '许有亮领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0013', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160825115026042657', '许杏红', '201606241738105582', '美都御府 2-2404', 200, 200, 1, 100, '2016-08-25 11:50:26', '2016-08-27 08:47:33', 'false', '18857242155', '0009', '许杏红领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0005', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160825115536036944', '许杏红', '201607131524477790', '金桂花园 6-801', 200, 200, 1, 100, '2016-08-25 11:55:36', '2016-08-27 08:47:40', 'false', '18857242155', '0009', '许杏红领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0013', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160825115542018375', '许杏红', '201608151003398829', '美都御府 1-2203', 200, 200, 1, 100, '2016-08-25 11:55:42', '2016-08-27 08:47:47', 'false', '18857242155', '0009', '许杏红领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0005', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160825115815072521', '许杏红', '201608151005543361', '奥体壹号二期 9-1406', 200, 200, 1, 100, '2016-08-25 11:58:15', '2016-08-26 10:02:11', 'false', '18857242155', '0009', '许杏红领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0005', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160825125933067570', '叶云程', '201607221532165929', '美都御府 1-803', 3072, 2150.4, 1, 90, '2016-08-25 12:59:33', '2016-08-27 12:37:52', 'false', '13867247432', '0004', '叶云程领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0011', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160825171904093611', '许有亮', '201505091455134963', '一里洋房6-2-804', 150, 150, 1, 100, '2016-08-25 17:19:04', '2016-08-26 09:45:30', 'false', '18656693129', '0009', '许有亮领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0005', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160825173044064515', '黄其春', '201605251006269608', '一里洋房 3-102', 1143.5, 1143.5, 1, 100, '2016-08-25 17:30:44', '2016-08-27 12:38:03', 'false', '15067263806', '0005', '黄其春领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0005', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160825173844008155', '徐和林', '201606241738105582', '美都御府 2-2404', 4000, 4000, 1, 100, '2016-08-25 17:38:44', '2016-08-26 09:37:41', 'false', '13059997279', '0002', '徐和林领款单', NULL, 'ppd', 'chk', 'Cw0001', 'gc0005', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160825174634062974', '许海斌', '201608171158355322', '上城 8-1601', 3580, 3580, 1, 100, '2016-08-25 17:46:34', '2016-08-27 11:54:49', 'false', '13059917128', '0004', '许海斌领款单', NULL, 'ppd', 'chk', 'Cw0001', 'gc0005', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160825174939096812', '黄其春', '201608171158355322', '上城 8-1601', 285, 285, 1, 100, '2016-08-25 17:49:39', '2016-08-27 08:47:23', 'false', '15067263806', '0005', '黄其春领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0005', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160825175258045955', '许有亮', '201512162019497775', '百合公寓 7-103', 150, 150, 1, 100, '2016-08-25 17:52:58', '2016-08-26 11:30:39', 'false', '18656693129', '0009', '许有亮领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0005', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160825180018000657', '黄其春', '201604271329251551', '上城 9-603', 170, 170, 1, 100, '2016-08-25 18:00:18', '2016-08-26 09:43:38', 'false', '15067263806', '0005', '黄其春领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0005', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160825180456087021', '许有亮', '201605251006269608', '一里洋房 3-102', 150, 150, 1, 100, '2016-08-25 18:04:56', '2016-08-27 12:38:13', 'false', '18656693129', '0009', '许有亮领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0005', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0'),
('20160826111050093262', '叶云程', '201605051942437023', '上城 6-1004', 5280, 3700, 1, 90, '2016-08-26 11:10:50', '2016-08-27 12:37:21', 'false', '13867247432', '0004', '叶云程领款单', NULL, 'reg', 'chk', 'Cw0001', 'gc0010', NULL, '', NULL, NULL, NULL, '统一修改置为已付', NULL, NULL, NULL, '0');


-- 数据修改更新要执行的sql：
update statement_bill set paidTime = now() , paidAmount = claimAmount , payer = 'admin' ,status = 'paid' , descpt= '统一修改置为已付' WHERE (billType =  'reg'OR billType =  'ppd')AND isDeleted =  'false' AND STATUS =  'chk';
