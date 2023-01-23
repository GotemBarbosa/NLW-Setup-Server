
import dayjs from 'dayjs'
import { FastifyInstance } from "fastify"
import { z } from 'zod'
import { prisma } from "./lib/prisma"

export async function appRoutes(app: FastifyInstance){

    app.post('/habits', async (request)=>{
        const createHabitBody = z.object({
            title: z.string(),
            weekDays: z.array(
                z.number().min(0).max(6)
            )
        })

        const { title, weekDays } = createHabitBody.parse(request.body)

        const today = dayjs().startOf('day').toDate()

        await prisma.habit.create({
            data:{
                title,
                created_at: today,
                weekDays:{
                    create: weekDays.map(weekDay =>{
                        return{
                            week_day: weekDay,
                        }
                    })
                }
            }
        })
    })

    app.get('/day', async (request)=>{





        const getDayParams = z.object({
            date:z.coerce.date()
        })

        const { date } = getDayParams.parse(request.query)

        const parsedDate = dayjs(date).startOf('day')
        const weekDay = parsedDate.get('day')

        const finishedHabits = await prisma.completedHabit.findMany()


        let possibleHabits = await prisma.habit.findMany({
            where: {
                created_at: {
                    lte: date,
                },
                weekDays: {
                    some: {
                        week_day: weekDay
                    }
                }
            }
        })
        
        let prevPossibleHabits = possibleHabits

        finishedHabits.map((finishedHabit)=>{
          possibleHabits.map((possibleHabit)=>{
            if(finishedHabit.habit_id === possibleHabit.id){
              if(dayjs(parsedDate).isAfter(dayjs(finishedHabit.completed_day), 'day')){
                possibleHabits = prevPossibleHabits.filter(possibleHabit=>possibleHabit.id !== finishedHabit.habit_id)
              }
            }
          })
        })
        

        const day = await prisma.day.findUnique({
            where: {
                date: parsedDate.toDate(),
            },
            include:{
                dayHabits: true
            }
        })

        const completedHabits = day?.dayHabits.map(dayHabit => {
            return dayHabit.habit_id
        }) ?? []
        return{
            possibleHabits,
            completedHabits
        }
    })

    app.patch("/habits/:id/toggle", async (request) => {
        const toggleHabitParams = z.object({
          id: z.string().uuid(),
        });
    
        const { id } = toggleHabitParams.parse(request.params);
        
        //validação para ser no mesmo dia
        const today = dayjs().startOf("day").toDate();
    
        let day = await prisma.day.findUnique({
          where: {
            date: today,
          },
        });
    
        if (!day) {
          day = await prisma.day.create({
            data: {
              date: today,
            },
          });
        }
    
        const dayHabit = await prisma.dayHabit.findUnique({
          where: {
            day_id_habit_id: {
              day_id: day.id,
              habit_id: id,
            },
          },
        });
    
        if (dayHabit) {
          await prisma.dayHabit.delete({
            where: {
              id: dayHabit.id,
            },
          });
        } else {
          await prisma.dayHabit.create({
            data: {
              day_id: day.id,
              habit_id: id,
            },
          });
        }
      });
    

    app.get('/summary', async()=>{
        
        const summary = await prisma.$queryRaw`
            SELECT 
                D.id,
                D.date,
                (
                    SELECT 
                        cast(count(*) as float)
                    FROM day_habits DH
                    WHERE DH.day_id = D.id
                ) as completed,
                (
                    SELECT
                        cast(count(*) as float)
                    FROM habit_week_days HWD
                    JOIN habits H
                        ON H.id = HWD.habit_id
                    WHERE
                        HWD.week_day = cast(strftime('%w', D.date/1000.0, 'unixepoch') as int)
                        AND H.created_at <= D.date
                ) as amount
            FROM day D
        `

        return summary
    })


    app.delete('/habits/:id/delete',async (request)=>{
      const deleteParams = z.object({
        id: z.string().uuid(),
      });
      const { id } = deleteParams.parse(request.params); 
      
      try{
        await prisma.habit.delete({
          where: {
            id: id
          },
        })
      }catch(error){
        console.log(error)
      }
      

    })


    app.post('/completedHabits',async(request)=>{

      const createCompletedHabitBody = z.object({
        id: z.string()
      })

      const {id} = createCompletedHabitBody.parse(request.body)
      const today = dayjs().startOf("day").toDate();
      
      await prisma.completedHabit.create({
        data:{
          completed_day: today,
          habit_id: id
        }
      })
    })

    app.get('/allHabits',async()=>{
      const habits = await prisma.habit.findMany({
        
        include:{
          weekDays:true
        }
      })
      const completedHabits = await prisma.completedHabit.findMany()
      type habitProps = Array<{
        id: string,
        title: string,
        created_at: Date,
        weekDays : number[]
        completed: boolean,
        completed_data?:{
          completed_date:  Date | undefined
        } 
      }>|undefined
      var habitsList: habitProps  = []

      habits.map((habit)=>{

        let weekDayList: number[] = []
        habit.weekDays.map((weekDay)=>{
          const prevWeekDayList = weekDayList
          weekDayList = [...prevWeekDayList, weekDay.week_day]
        })


        var isCompleted = false
        var completedDate

        completedHabits.map((completedHabit)=>{
          if(completedHabit.habit_id === habit.id){
            isCompleted = true
            completedDate = completedHabit.completed_day
          }
        })

        const prevHabitList: habitProps = habitsList

        if(isCompleted){  
          habitsList = [...(prevHabitList || []), {
          id: habit.id,
          title: habit.title,
          created_at: habit.created_at,
          weekDays: weekDayList,
          completed: isCompleted,
          completed_data:{
            completed_date: completedDate
          }
          }]

        }else{
          habitsList = [...(prevHabitList || []), {
            id: habit.id,
            title: habit.title,
            created_at: habit.created_at,
            weekDays: weekDayList,
            completed: isCompleted,
            completed_data:{
              completed_date: undefined
            }
            }]
        }
        
      })
      return habitsList
    })
}


