import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStudentInput } from './graphql/create-student.input';
import { Student } from './entity/student.entity';
import { v4 as uuid } from 'uuid'; 

@Injectable()
export class StudentService {

    constructor(
        @InjectRepository(Student) private studentRepository:Repository<Student>
    ) {}



    async getStudent(id:string):Promise<Student> {
        return this.studentRepository.findOneBy({
            id
        });
    }


    async getStudents():Promise<Student[]> {
        return this.studentRepository.find();
    }


    async getManyStudents(studentIds:string[]): Promise<Student[]> {
        return this.studentRepository.find({
            where: {
                id: {
                    $in: studentIds,
                } as any
            }
        })
    }


    async createStudent(createStudentInput:CreateStudentInput):Promise<Student> {
        const {firstName, lastName} = createStudentInput;

        const student = this.studentRepository.create({
            id: uuid(),
            firstName,
            lastName
        })

        return this.studentRepository.save(student);
    }


    async removeStudent(id:string) {
        const studentToRemove = await this.studentRepository.findOneBy({
            id
        });

        await this.studentRepository.remove(studentToRemove);

        return true;
    }
}
