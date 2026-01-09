import { HttpStatus, Inject, Injectable } from '@nestjs/common';
// import { CreatePdfGeneratorDto } from './dto/create-pdf-generator.dto';
// import { UpdatePdfGeneratorDto } from './dto/update-pdf-generator.dto';
// import * as PDFDocument from 'pdfkit'
// import { PDFOptions, PDFService } from '@t00nday/nestjs-pdf';

import { Brackets, DataSource } from 'typeorm';

import { SendNewEmailDto } from './dto/send-new-email.dto';
import {
  // Child,
  // CoreTime,
  // Country,
  // CsEligibility,
  // Dtr,
  // ESig,
  // EducBackgroud,
  // Employee,
  // EmployeeAssessment,
  // EmployeeAssessmentPerformanceCategory,
  // EmploymentStatus,
  // FamilyBackground,
  // GeneratedServiceRecord,
  // GovIssuedId,
  // Ildp,
  // Institute,
  // Ipcr,
  // IpcrMpor,
  // IpcrSummaryRating,
  // IpcrSupport,
  // IpcrSupportUtil,
  // IpcrTarget,
  // IpcrTargetRating,
  // LearningAndDevelopment,
  // LeaveCredit,
  // Leaves,
  // MyCoreTime,
  // MyIldp,
  // MyLocatorSlip,
  // Office,
  // OpcrPapTargetDistributedTagging,
  // OpcrSupport,
  // OpcrTarget,
  // OpcrTargetAccomplishment,
  // OtherInfo,
  // OtherInfoAssocMembership,
  // OtherInfoNonAcad,
  // OtherInfoSpecialSkill,
  // Pap,
  // PapTagged,
  // PapYearly,
  // PersonalQuestionAnswer,
  // Position,
  // Reference,
  // SalaryFyGuide,
  // SalaryGrade,
  // Saln,
  // SalnAssetA,
  // SalnAssetB,
  // SalnBifc,
  // SalnChild,
  // SalnLiability,
  // SalnRelativesInGov,
  // Tar,
  // TravelOrder,
  // TypesOfLeave,
  // UserDetail,
  // UserPositionOfficeAtm,
  // Users,
  // VoluntaryWork,
  // WorkExperience,
} from 'src/entities';
import { join } from 'path';
import { log } from 'console';
// import { scale } from 'pdfkit';
// import {
//   computeTotal,
//   formatActualAccompishment,
//   formatSuccessIndicator,
//   getTotal,
//   loadSummaryHeader,
// } from 'src/ipcr-target/shared-function';
import {
  getCurrentDateString,
  getDaysInDashed,
  roundToDecimal,
} from 'src/shared/global-function';

// import newFs
const hbs = require('handlebars');
const QRCode = require('qrcode');
const path = require('path');
const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const moment = require('moment');
const fs1 = require('fs');

hbs.registerHelper('dateFormat', function (value) {
  if (value) {
    return moment(value).format('MM/DD/YYYY');
  }
  return;
});

hbs.registerHelper('formatTime', function (time, format = 'h:mm a') {
  if (time) {
    return moment(time).format(format);
  }
  return;
});

hbs.registerHelper('formatAlphanumericDate', function (value) {
  if (value) {
    return moment(value).format('MMMM DD, YYYY');
  }
  return;
});

hbs.registerHelper('toUpperCase', function (value) {
  if (typeof value === 'string') {
    return value.toUpperCase();
  }
  return;
});

hbs.registerHelper('concatenate', function (value, value1) {
  return value + '/' + value1;
});

hbs.registerHelper("toFixed", function (value) {
  if (typeof value !== "number") {
    value = parseFloat(value);
  }
  if (isNaN(value)) return value;
  return value.toFixed(2);
});

hbs.registerHelper('formatAmount', function (value) {
  const val = (value / 1).toFixed(2).replace(',', '.');
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
});

hbs.registerHelper('getAnnual', function (value) {
  var annual = 0;
  for (let i = 0; i < 12; i++) {
    annual += parseFloat(value);
  }
  return annual;
});

hbs.registerHelper('curDate', function (formattype) {
  if (formattype == 'numeric') {
    return moment().format('MM/DD/YYYY');
  } else if (formattype == 'alphanumeric') {
    return moment().format('MMMM DD, YYYY');
  } else if (formattype == 'daywithsuffix') {
    return moment().format('Do') + ' day of ' + moment().format('MMMM, YYYY');
  }
});

hbs.registerHelper('getPresentDate', function () {
  return moment().format('MM/DD/YY');
});

hbs.registerHelper('formatDate', function (value) {
  return moment(value).format('MM/DD/YY');
});
hbs.registerHelper('formatDateWord', function (value) {
  return moment(value).format('MMMM D, YYYY');
});

hbs.registerHelper('sexFormat', function (value) {
  if (value) {
    if (value.toLowerCase() == 'male') {
      return 'M';
    } else if (value.toLowerCase() == 'female') {
      return 'F';
    }
  }
});

hbs.registerHelper('for', function (from, to, incr, block) {
  var accum = '';
  for (var i = from; i < to; i += incr) accum += block.fn(i);
  return accum;
});

hbs.registerHelper('JSONParse', function (value) {
  return JSON.parse(value);
});

hbs.registerHelper('calcAge', function (value) {
  var dob = new Date(value);
  var diff_ms = Date.now() - dob.getTime();
  var age_dt = new Date(diff_ms);
  return Math.abs(age_dt.getUTCFullYear() - 1970);
});

hbs.registerHelper('ifEqual', function (value, conditionVal) {
  return value == conditionVal ? true : false;
});

hbs.registerHelper('formatValueIfNotIsNaN', function (value) {
  if (isNaN(value)) {
    return value;
  } else {
    const val = (value / 1).toFixed(2).replace(',', '.');
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
});

hbs.registerHelper('tableDateFormat', function (value) {
  const date = new Date(value);
  const mnthsArr = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const d = date.getDate();
  const month = mnthsArr[date.getMonth()];
  const yr = date.getFullYear();
  return d + '-' + month + '-' + yr.toString().substring(2);
});

hbs.registerHelper('getCurrentMonth', function () {
  const date = new Date();
  const mnthsArr = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const month = mnthsArr[date.getMonth()];

  return month;
});

hbs.registerHelper('getCurrentYear', function () {
  const date = new Date();
  const yr = date.getFullYear();

  return yr;
});

hbs.registerHelper('getPrevYear', function () {
  const date = new Date();
  const yr = date.getFullYear() - 1;

  return yr;
});

// hbs.registerHelper('ifCond', function (v1, v2, options) {
//   if (v1 === v2) {
//     return options.fn(this);
//   }
//   return options.inverse(this);
// });
hbs.registerHelper('ifCond', function (v1, v2, options) {
  return v1 == v2 ? options.fn(this) : options.inverse(this);
});

hbs.registerHelper('getObject', function (arr, index) {
  return arr[index];
});

hbs.registerHelper('getValue', function (arr, data) {
  return arr.data;
});

hbs.registerHelper('ifAns', function (v1, v2, options) {
  if (v1 == v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

hbs.registerHelper('ifCount', function (v1, v2, options) {
  if (v1 > v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

hbs.registerHelper('isNotNull', function (v1, options) {
  if (v1 != null) {
    return options.fn(this);
  }
  return options.inverse(this);
});

hbs.registerHelper('isNotNullAndNotNAandNotEmpty', function (v1, options) {
  if (
    v1 != null &&
    v1.toString().replace(/\s/g, '').replace(/\t/g, '').toLowerCase() !=
      'n/a' &&
    v1 != ' ' &&
    v1 != ''
  ) {
    return options.fn(this);
  }
  return options.inverse(this);
});

hbs.registerHelper('formatName', function (fname, mname, lname) {
  if (
    mname != '' &&
    mname != null &&
    mname.toLowerCase() != 'null' &&
    mname.toLowerCase() != 'n/a' &&
    mname.toLowerCase() != 'na'
  ) {
    return fname + ' ' + mname[0] + '. ' + lname;
  } else {
    return fname + ' ' + lname;
  }
});

hbs.registerHelper('toTitleCase', function (val) {
  return val.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
});

hbs.registerHelper('getCount', function (val) {
  return val.length;
});

hbs.registerHelper('hasData', function (v1, v2, options) {
  if (v1.length > v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

hbs.registerHelper('getPercentage', function (val, totalVal) {
  let percentage = (val / totalVal) * 100;
  return percentage.toFixed(2);
});

hbs.registerHelper('formatGovIDDateIssued', function (val) {
  if (val) {
    let dump = val.split('/');
    let str;
    let str1;
    let str2;
    str1 = dump[0] == null || dump[0] == 'null' ? null : dump[0];
    str2 = dump[1] == null || dump[1] == 'null' ? null : dump[1];
    if (str1 && str2) {
      str = str1 + '/' + str2;
    } else if (str1 && !str2) {
      str = str1;
    } else if (!str1 && str2) {
      str = str2;
    } else if (!str1 && !str2) {
      str = 'N/A';
    }
    return str;
  } else {
    return 'N/A';
  }
});

hbs.registerHelper('formatNumberValue', function (value, decimals) {
  const val = (value / 1).toFixed(decimals).replace(',', '.');
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}),
  // hbs.registerHelper('compute', function (val1, val2, operator) {
  //   //operator must be string;
  //   let toReturn;

  //   switch (operator) {
  //     case 'add':
  //       toReturn = val1 + val2;
  //       break;
  //       case 'subtract':
  //         toReturn = val1 - val2;
  //       break;
  //       case 'multiply':
  //         toReturn = val1 * val2;
  //       break;

  //       case 'divide':
  //         toReturn = val1 / val2;
  //       break;

  //   }

  //   return toReturn;
  // });

  hbs.registerHelper('math', function (lvalue, operator, rvalue, options) {
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);

    return {
      '+': lvalue + rvalue,
    }[operator];
  });

hbs.registerHelper('getCFSP_Avg', function (item, tab) {
  let divisor = 0;
  let subT = 0;

  if (tab === 1) {
    if (item.QL_is_rated) {
      subT += item.efficiency_rate ? parseInt(item.efficiency_rate) : 0;
      divisor++;
    }
    if (item.QT_is_rated) {
      subT += item.qly_rate ? parseInt(item.qly_rate) : 0;
      divisor++;
    }
    if (item.timeliness_is_rated) {
      subT += item.timeliness_rate ? parseInt(item.timeliness_rate) : 0;
      divisor++;
    }
    return divisor > 0 ? (subT / divisor).toFixed(2) : 0;
  } else {
    const eff = parseInt(item.efficiency_rate) || 0;
    const qly = parseInt(item.qly_rate) || 0;
    const time = parseInt(item.timeliness_rate) || 0;
    return ((eff + qly + time) / 3).toFixed(2);
  }
});


hbs.registerHelper('getSFAvg', function (item) {
  let divisor = 0;
  let subT = 0;
  if (item.eff_is_rated) {
    subT += item.efficiency ? parseInt(item.efficiency) : 0;
    divisor++;
  }
  if (item.qly_is_rated) {
    subT += item.quality ? parseInt(item.quality) : 0;
    divisor++;
  }
  if (item.timeliness_is_rated) {
    subT += item.timeliness ? parseInt(item.timeliness) : 0;
    divisor++;
  }
  return divisor === 0 ? 0 : (subT / divisor).toFixed(2);
});


hbs.registerHelper('inc', (value) => parseInt(value) + 1);

let cfCounter = 0;

hbs.registerHelper('cfCounter', () => {
  cfCounter++;
  return 'CF' + cfCounter;
});

hbs.registerHelper('resetCfCounter', () => {
  cfCounter = 0;
});

let spCounter = 0;

hbs.registerHelper('spCounter', () => {
  spCounter++;
  return 'SP' + spCounter;
});

hbs.registerHelper('resetSpCounter', () => {
  spCounter = 0;
});

let sfCounter = 0;

hbs.registerHelper('sfCounter', () => {
  sfCounter++;
  return 'SF' + sfCounter;
});

hbs.registerHelper('resetSfCounter', () => {
  sfCounter = 0;
});

@Injectable()
export class PdfGeneratorService {
  constructor(
    private dataSource: DataSource,
  ) {}

  async compile(templatename, data) {
    // //development
    //   process.cwd(),
    //   'src/pdf-generator/templates',
    //   `${templatename}.hbs`,
    // );

    //hosted filepath for pdf

    const filepath = path.join(
      __dirname,
      '../pdf-generator/templates',
      `${templatename}.hbs`,
    );

    const html = await fs.readFile(filepath, 'utf-8');
    return hbs.compile(html)(data);
  }



  base64_encode(file, type) {
    // read binary data
    var bitmap;
    if (type == 'profile') {
      if (fs.existsSync(file) == true) {
        bitmap = fs.readFileSync(file);
      } else {
        bitmap = fs.readFileSync(
          join(process.cwd(), '/../upload_img/img_avatar.png'),
        );
      }
    } else if (type == 'headerfooter') {
      bitmap = fs.readFileSync(file);
    } else if (type == 'esig') {
      if (fs.existsSync(file) == true) {
        bitmap = fs.readFileSync(file);
      } else {
        return;
      }
    }

    // convert binary data to base64 encoded string
    return Buffer.from(bitmap).toString('base64');
  }
  getFirstDate(data: any) {
    let dump = JSON.parse(data);
    return dump[0];
  }

  isValidJSON(str: any) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  formatDate(value) {
    return moment(value).format('MMM DD,YYYY');
  }

 

  // async facultyIPCR(ipcrID: number) {
  //   let ipcr = await this.dataSource.manager
  //     .createQueryBuilder(Ipcr, 'ipcr')
  //     .where('ipcr.id = :ipcrID ', { ipcrID })
  //     .getOne();

  //   let user = await this.dataSource.manager
  //     .createQueryBuilder(UserDetail, 'us')
  //     .select([
  //       "IF (!ISNULL(us.mname)  AND LOWER(us.mname) != 'n/a', concat(us.fname, ' ',SUBSTRING(us.mname, 1, 1) ,'. ',us.lname) ,concat(us.fname, ' ', us.lname)) as name",
  //       'o.name as office_name',
  //       'p.description as position',
  //       'esig.esign_filename as esign_filename',
  //     ])
  //     .leftJoin(Employee, 'e', 'us.id = e.user_detailID')
  //     .leftJoin(Office, 'o', 'o.id = e.officeID')
  //     .leftJoin(Position, 'p', 'p.id = e.positionID')
  //     .leftJoin(ESig, 'esig', 'esig.user_detailID = us.id')
  //     .where('us.id = :userID', { userID: ipcr.user_detailID })
  //     .getRawOne();


  //   let signatory = await this.dataSource.manager
  //     .createQueryBuilder(Ipcr, 'ipcr')
  //     .select([
  //       "IF (!ISNULL(us.mname)  AND LOWER(us.mname) != 'n/a', concat(us.fname, ' ',SUBSTRING(us.mname, 1, 1) ,'. ',us.lname) ,concat(us.fname, ' ', us.lname)) as assesedBy",
  //       'o.name as assesedByOffice',
  //       'p.description as assesedByPosition',
  //       "IF (!ISNULL(us1.mname)  AND LOWER(us1.mname) != 'n/a', concat(us1.fname, ' ',SUBSTRING(us1.mname, 1, 1) ,'. ',us1.lname) ,concat(us1.fname, ' ', us1.lname)) as finalRatingBy",
  //       'o1.name as finalRatingByOffice',
  //       'p1.description as finalRatingByPosition',
  //       'esig.esign_filename as assesedEsign_filename',
  //       'esig1.esign_filename as finalRatingEsign_filename',
  //     ])
  //     .leftJoin(UserDetail, 'us', 'us.id = ipcr.assesed_by')
  //     .leftJoin(UserDetail, 'us1', 'us1.id = ipcr.final_rating_by')
  //     .leftJoin(Employee, 'e', 'us.id = e.user_detailID')
  //     .leftJoin(Employee, 'e1', 'us1.id = e1.user_detailID')
  //     .leftJoin(Office, 'o', 'o.id = e.officeID')
  //     .leftJoin(Office, 'o1', 'o1.id = e1.officeID')
  //     .leftJoin(Position, 'p', 'p.id = e.positionID')
  //     .leftJoin(Position, 'p1', 'p1.id = e1.positionID')
  //     .leftJoin(ESig, 'esig', 'esig.user_detailID = us.id')
  //     .leftJoin(ESig, 'esig1', 'esig1.user_detailID = us1.id')
  //     .where('ipcr.id = :ipcrID', { ipcrID })
  //     .execute();

      
  //     let user_esigImgDum;
  //     let user_esigImg;
  //     let assesed_esignImgDum
  //     let assesed_esignImg
  //     let finalRating_esignImgDum
  //     let finalRating_esignImg

  //     if (user.esign_filename) {
  //     user_esigImgDum = join(
  //       process.cwd(),
  //       // '/../uploadedEsigImg/' + user.esign_filename,
  //       '/uploadedEsigImg/' + user.esign_filename,
  //     );
  //     user_esigImg = this.base64_encode(user_esigImgDum, 'esig');
  //     }


  //     if (signatory[0].assesedEsign_filename) {
  //     assesed_esignImgDum = join(
  //       process.cwd(),
  //       // '/../uploadedEsigImg/' + signatory.assesedEsign_filename,
  //       '/uploadedEsigImg/' + signatory[0].assesedEsign_filename,
  //     );
  //     assesed_esignImg = this.base64_encode(assesed_esignImgDum, 'esig');
  //     }


  //     if (signatory[0].finalRatingEsign_filename) {
  //     finalRating_esignImgDum = join(
  //       process.cwd(),
  //       // '/../uploadedEsigImg/' + signatory.finalRatingEsign_filename,
  //       '/uploadedEsigImg/' + signatory[0].finalRatingEsign_filename,
  //     );
  //     finalRating_esignImg = this.base64_encode(finalRating_esignImgDum, 'esig');
  //     }

  //     console.log(user_esigImg)

  //   let esignHas = {
  //     user_hasEsig :  user.esign_filename ? true : false,
  //     asessed_hasEsign: signatory[0].assesedEsign_filename ? true : false,
  //     finalRating_hasEsign: signatory[0].finalRatingEsign_filename ? true : false,
  //   };

  //   let coreFunction;
  //   let strategicPriority;
  //   let supportFunction;
  //   let category;

  //   let facultyIPCRData = await this.IpcrService.getFacultyIPCR(ipcrID);
  //   if (!Array.isArray(facultyIPCRData)) {
  //     coreFunction = facultyIPCRData.data[0];
  //     strategicPriority = facultyIPCRData.data[1];
  //     supportFunction = facultyIPCRData.data[2];
  //     category = facultyIPCRData.category;
  //   }
  //   let totalCoreFunction = category[0];
  //   let totalStrategicPriority = category[1];
  //   let totalSupportFunction = category[2];
  //   let coreFunctionInstruction = coreFunction.data[0];
  //   let coreFunctionDesignated = coreFunction.data[1];
  //   let strategicPriorityResearch = strategicPriority.data[0];
  //   let strategicPriorityExtension = strategicPriority.data[1];
  //   let supportFunctionInstitutional = supportFunction.data[0];
  //   let supportFunctionProfessional = supportFunction.data[1];
  //   let supportFunctionIntervening = supportFunction.data[2];
  //   let overallRating = category[3];
  //   let finalAverage = category[4];
  //   let sf1_legnth = supportFunctionInstitutional.length;
  //   let sf2_legnth = supportFunctionProfessional.length;

  //   // console.log(totalCoreFunction)

  //   let headerImg = join(process.cwd(), '/static/img/New Header  form.png');
  //   let footerImg = join(process.cwd(), '/static/img/new_footer.png');
  //   // let headerImg = join(process.cwd(), '/../static/img/New Header  form.png');
  //   // let footerImg = join(process.cwd(), '/../static/img/new_footer.png');

  //   const data = [
  //     {
  //       header_img: this.base64_encode(headerImg, 'headerfooter'),
  //       footer_img: this.base64_encode(footerImg, 'headerfooter'),
  //       facultyIPCRData,
  //       signatory,
  //       user,
  //       ipcr,
  //       coreFunction,
  //       coreFunctionInstruction,
  //       coreFunctionDesignated,
  //       totalCoreFunction,
  //       strategicPriority,
  //       strategicPriorityResearch,
  //       strategicPriorityExtension,
  //       totalStrategicPriority,
  //       supportFunction,
  //       supportFunctionInstitutional,
  //       supportFunctionProfessional,
  //       supportFunctionIntervening,
  //       totalSupportFunction,
  //       category,
  //       overallRating,
  //       finalAverage,
  //       sf1_legnth,
  //       sf2_legnth,
  //       user_esigImg,
  //       assesed_esignImg,
  //       finalRating_esignImg,
  //       esignHas
  //     },
  //   ];
  //   try {
  //     const browser = await puppeteer.launch();
  //     const page = await browser.newPage();
  //     // compile(template_name, data)
  //     const content = await this.compile('faculty_ipcr', data);

  //     await page.setContent(content);

  //     const buffer = await page.pdf({
  //       format: 'legal',
  //       margin: {
  //         top: '0.20in',
  //         left: '0.50in',
  //         bottom: '0.03in',
  //         right: '0.50in',
  //       },
  //       landscape: true,
  //       printBackground: true,
  //       // displayHeaderFooter: true,
  //     });
  //     // console.log('Applicant generated');
  //     await browser.close();
  //     return buffer;
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }
  //   async facultyIPCRTarget(ipcrID: number) {
  //   let ipcr = await this.dataSource.manager
  //     .createQueryBuilder(Ipcr, 'ipcr')
  //     .where('ipcr.id = :ipcrID ', { ipcrID })
  //     .getOne();

  //   let user = await this.dataSource.manager
  //     .createQueryBuilder(UserDetail, 'us')
  //     .select([
  //       "IF (!ISNULL(us.mname)  AND LOWER(us.mname) != 'n/a', concat(us.fname, ' ',SUBSTRING(us.mname, 1, 1) ,'. ',us.lname) ,concat(us.fname, ' ', us.lname)) as name",
  //       'o.name as office_name',
  //       'p.description as position',
  //     ])
  //     .leftJoin(Employee, 'e', 'us.id = e.user_detailID')
  //     .leftJoin(Office, 'o', 'o.id = e.officeID')
  //     .leftJoin(Position, 'p', 'p.id = e.positionID')
  //     .where('us.id = :userID', { userID: ipcr.user_detailID })
  //     .getRawOne();
  //   let signatory = await this.dataSource.manager
  //     .createQueryBuilder(Ipcr, 'ipcr')
  //     .select([
  //       "IF (!ISNULL(us.mname)  AND LOWER(us.mname) != 'n/a', concat(us.fname, ' ',SUBSTRING(us.mname, 1, 1) ,'. ',us.lname) ,concat(us.fname, ' ', us.lname)) as assesedBy",
  //       'o.name as assesedByOffice',
  //       'p.description as assesedByPosition',
  //       "IF (!ISNULL(us1.mname)  AND LOWER(us1.mname) != 'n/a', concat(us1.fname, ' ',SUBSTRING(us1.mname, 1, 1) ,'. ',us1.lname) ,concat(us1.fname, ' ', us1.lname)) as finalRatingBy",
  //       'o1.name as finalRatingByOffice',
  //       'p1.description as finalRatingByPosition',
  //     ])
  //     .leftJoin(UserDetail, 'us', 'us.id = ipcr.assesed_by')
  //     .leftJoin(UserDetail, 'us1', 'us1.id = ipcr.final_rating_by')
  //     .leftJoin(Employee, 'e', 'us.id = e.user_detailID')
  //     .leftJoin(Employee, 'e1', 'us1.id = e1.user_detailID')
  //     .leftJoin(Office, 'o', 'o.id = e.officeID')
  //     .leftJoin(Office, 'o1', 'o1.id = e1.officeID')
  //     .leftJoin(Position, 'p', 'p.id = e.positionID')
  //     .leftJoin(Position, 'p1', 'p1.id = e1.positionID')
  //     .where('ipcr.id = :ipcrID', { ipcrID })
  //     .execute();

  //   let coreFunction;
  //   let strategicPriority;
  //   let supportFunction;
  //   let category;

  //   let facultyIPCRData = await this.IpcrService.getFacultyIPCR(ipcrID);
  //   if (!Array.isArray(facultyIPCRData)) {
  //     coreFunction = facultyIPCRData.data[0];
  //     strategicPriority = facultyIPCRData.data[1];
  //     supportFunction = facultyIPCRData.data[2];
  //     category = facultyIPCRData.category;
  //   }
  //   let totalCoreFunction = category[0];
  //   let totalStrategicPriority = category[1];
  //   let totalSupportFunction = category[2];
  //   let coreFunctionInstruction = coreFunction.data[0];
  //   let coreFunctionDesignated = coreFunction.data[1];
  //   let strategicPriorityResearch = strategicPriority.data[0];
  //   let strategicPriorityExtension = strategicPriority.data[1];
  //   let supportFunctionInstitutional = supportFunction.data[0];
  //   let supportFunctionProfessional = supportFunction.data[1];
  //   let supportFunctionIntervening = supportFunction.data[2];
  //   let overallRating = category[3];
  //   let finalAverage = category[4];
  //   let sf1_legnth = supportFunctionInstitutional.length;
  //   let sf2_legnth = supportFunctionProfessional.length;

  //   console.log(supportFunctionProfessional)

  //   let headerImg = join(process.cwd(), '/static/img/New Header  form.png');
  //   let footerImg = join(process.cwd(), '/static/img/new_footer.png');
  //   // let headerImg = join(process.cwd(), '/../static/img/New Header  form.png');
  //   // let footerImg = join(process.cwd(), '/../static/img/new_footer.png');

  //   const data = [
  //     {
  //       header_img: this.base64_encode(headerImg, 'headerfooter'),
  //       footer_img: this.base64_encode(footerImg, 'headerfooter'),
  //       facultyIPCRData,
  //       signatory,
  //       user,
  //       coreFunction,
  //       coreFunctionInstruction,
  //       coreFunctionDesignated,
  //       totalCoreFunction,
  //       strategicPriority,
  //       strategicPriorityResearch,
  //       strategicPriorityExtension,
  //       totalStrategicPriority,
  //       supportFunction,
  //       supportFunctionInstitutional,
  //       supportFunctionProfessional,
  //       supportFunctionIntervening,
  //       totalSupportFunction,
  //       category,
  //       overallRating,
  //       finalAverage,
  //       sf1_legnth,
  //       sf2_legnth,
  //     },
  //   ];
  //   try {
  //     const browser = await puppeteer.launch();
  //     const page = await browser.newPage();
  //     // compile(template_name, data)
  //     const content = await this.compile('faculty_ipcr_target', data);

  //     await page.setContent(content);

  //     const buffer = await page.pdf({
  //       format: 'legal',
  //       margin: {
  //         top: '0.20in',
  //         left: '0.50in',
  //         bottom: '0.03in',
  //         right: '0.50in',
  //       },
  //       landscape: true,
  //       printBackground: true,
  //       // displayHeaderFooter: true,
  //     });
  //     // console.log('Applicant generated');
  //     await browser.close();
  //     return buffer;
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }


}
