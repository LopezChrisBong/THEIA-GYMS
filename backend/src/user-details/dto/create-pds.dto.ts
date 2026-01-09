import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator"

export class CreatePDSDto {
    @ApiProperty()
    email: string


    @ApiProperty()
    fname: string


    @ApiProperty()
    mname: string

    @ApiProperty()
    lname: string

    @ApiProperty()
    suffix: string

    @ApiProperty()
    bdate: string

    @ApiProperty()
    birth_place: string

    @ApiProperty()
    sex: string

    @ApiProperty()
    civil_status: string

    @ApiProperty()
    civil_status_others: string



    @ApiProperty()
    height: string

    @ApiProperty()
    weight: string

    @ApiProperty()
    blood_type: string

    @ApiProperty()
    GSIS: string

    @ApiProperty()
    PAGIBIG: string

    @ApiProperty()
    SSS: string

    @ApiProperty()
    TIN: string

    @ApiProperty()
    PHILHEALTH: string


    @ApiProperty()
    agency_employee_num: string

    @ApiProperty()
    citizenship: string

    @ApiProperty()
    is_dual_citizen: string

    @ApiProperty()
    citizenship_type: number

    @ApiProperty()
    country: number

    @ApiProperty()
    tel_no: string

    @ApiProperty()
    mobile_no: string

    @ApiProperty()
    residential_zip: string

    @ApiProperty()
    residential_house_no: string

    @ApiProperty()
    residential_street: string

    @ApiProperty()
    residential_subd: string

    @ApiProperty()
    residential_brgy: string

    @ApiProperty()
    residential_city: string

    @ApiProperty()
    residential_prov: string

    @ApiProperty()
    permanent_zip: string

    @ApiProperty()
    permanent_house_no: string

    @ApiProperty()
    permanent_street: string

    @ApiProperty()
    permanent_subd: string

    @ApiProperty()
    permanent_brgy: string

    @ApiProperty()
    permanent_city: string

    @ApiProperty()
    permanent_prov: string

    @ApiProperty()
    family_background: string

    @ApiProperty()
    children: string


    @ApiProperty()
    educ_background: string


    @ApiProperty()
    cs_eligibility: string

    @ApiProperty()
    work_exp: string

    @ApiProperty()
    voluntary_work: string

    @ApiProperty()
    learning_and_development: string

    @ApiProperty()
    other_infos: string

    @ApiProperty()
    personal_question_answer: string

    @ApiProperty()
    references: string

    @ApiProperty()
    gov_issued_id: string

}