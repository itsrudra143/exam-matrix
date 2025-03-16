import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a new test
export const createTest = async (req, res) => {
  try {
    const { title, description, duration, maxAttempts, expiryDuration, expiryUnit, startTime, questions } = req.body;
    const createdById = req.user.id;

    // Create test with questions and options in a transaction
    const test = await prisma.$transaction(async (prisma) => {
      // Create test
      const newTest = await prisma.test.create({
        data: {
          title,
          description,
          duration: duration || 60,
          maxAttempts: maxAttempts === -1 ? 20 : maxAttempts || 1, // Use 20 for unlimited attempts instead of null
          expiryDuration: expiryDuration || null,
          expiryUnit: expiryUnit || "days",
          startTime: startTime ? new Date(startTime) : null,
          createdById: createdById
        }
      });

      // Create questions and options
      if (questions && questions.length > 0) {
        for (let i = 0; i < questions.length; i++) {
          const question = questions[i];
          
          // Create question
          const newQuestion = await prisma.question.create({
            data: {
              testId: newTest.id,
              text: question.text,
              type: question.type,
              required: question.required || false,
              order: i + 1
            }
          });

          // Create options for MCQ and checkbox questions
          if ((question.type === 'MCQ' || question.type === 'CHECKBOX') && 
              question.options && question.options.length > 0) {
            for (const option of question.options) {
              await prisma.option.create({
                data: {
                  questionId: newQuestion.id,
                  text: option.text,
                  isCorrect: option.isCorrect || false
                }
              });
            }
          }
        }
      }

      return newTest;
    });

    res.status(201).json({
      message: 'Test created successfully',
      test
    });
  } catch (error) {
    console.error('Create test error:', error);
    res.status(500).json({ message: 'Server error while creating test' });
  }
};

// Get all tests
export const getAllTests = async (req, res) => {
  try {
    const { id: userId, role } = req.user;
    const now = new Date();
    
    // First, update any tests that should be activated based on start time
    await prisma.test.updateMany({
      where: {
        startTime: { lte: now },
        isActive: false
      },
      data: {
        isActive: true
      }
    });
    
    // Get all tests that might have expired
    const testsWithExpiry = await prisma.test.findMany({
      where: {
        expiryDuration: { not: null },
        status: { not: 'COMPLETE' },
        isPublished: false
      },
      select: {
        id: true,
        createdAt: true,
        expiryDuration: true,
        expiryUnit: true
      }
    });
    
    // Check each test if it has expired based on its creation date and expiry settings
    const expiredTestIds = [];
    for (const test of testsWithExpiry) {
      const expiryDate = new Date(test.createdAt);
      
      if (test.expiryUnit === 'minutes') {
        expiryDate.setMinutes(expiryDate.getMinutes() + test.expiryDuration);
      } else if (test.expiryUnit === 'hours') {
        expiryDate.setHours(expiryDate.getHours() + test.expiryDuration);
      } else {
        // Default to days
        expiryDate.setDate(expiryDate.getDate() + test.expiryDuration);
      }
      
      if (now > expiryDate) {
        expiredTestIds.push(test.id);
      }
    }
    
    // Update tests with end time in the past
    await prisma.test.updateMany({
      where: {
        endTime: { lte: now },
        status: { not: 'COMPLETE' },
        isPublished: false
      },
      data: {
        status: 'EXPIRED',
        isActive: false
      }
    });
    
    // Update tests that have expired based on expiryDuration
    if (expiredTestIds.length > 0) {
      await prisma.test.updateMany({
        where: {
          id: { in: expiredTestIds }
        },
        data: {
          status: 'EXPIRED',
          isActive: false
        }
      });
    }
    
    // Different queries for admin and student
    let tests;
    
    if (role === 'ADMIN') {
      // Admins can only see tests they created
      tests = await prisma.test.findMany({
        where: {
          createdById: userId // Only return tests created by this admin
        },
        orderBy: { createdAt: 'desc' },
        include: {
          createdBy: {
            select: {
              firstName: true,
              lastName: true
            }
          },
          _count: {
            select: { questions: true }
          }
        }
      });
    } else {
      // Students can only see active tests that are not expired
      tests = await prisma.test.findMany({
        where: {
          isActive: true,
          OR: [
            { endTime: null },
            { endTime: { gt: now } }
          ]
        },
        orderBy: { createdAt: 'desc' },
        include: {
          createdBy: {
            select: {
              firstName: true,
              lastName: true
            }
          },
          _count: {
            select: { questions: true }
          }
        }
      });
    }

    res.json(tests);
  } catch (error) {
    console.error('Get tests error:', error);
    res.status(500).json({ message: 'Server error while fetching tests' });
  }
};

// Get test by ID
export const getTestById = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, id: userId } = req.user;
    const now = new Date();

    // Check if the test should be activated based on start time
    await prisma.test.updateMany({
      where: {
        id,
        startTime: { lte: now },
        isActive: false
      },
      data: {
        isActive: true
      }
    });
    
    // Check if the test has expired based on end time
    await prisma.test.updateMany({
      where: {
        id,
        endTime: { lte: now },
        status: { not: 'COMPLETE' },
        isPublished: false
      },
      data: {
        status: 'EXPIRED',
        isActive: false
      }
    });
    
    // Get the test to check if it has expired based on expiryDuration
    const testWithExpiry = await prisma.test.findUnique({
      where: { id },
      select: {
        expiryDuration: true,
        expiryUnit: true,
        createdAt: true,
        status: true,
        isPublished: true
      }
    });
    
    if (testWithExpiry && 
        testWithExpiry.expiryDuration && 
        testWithExpiry.status !== 'COMPLETE' && 
        !testWithExpiry.isPublished) {
      
      const expiryDate = new Date(testWithExpiry.createdAt);
      
      if (testWithExpiry.expiryUnit === 'minutes') {
        expiryDate.setMinutes(expiryDate.getMinutes() + testWithExpiry.expiryDuration);
      } else if (testWithExpiry.expiryUnit === 'hours') {
        expiryDate.setHours(expiryDate.getHours() + testWithExpiry.expiryDuration);
      } else {
        // Default to days
        expiryDate.setDate(expiryDate.getDate() + testWithExpiry.expiryDuration);
      }
      
      if (now > expiryDate) {
        await prisma.test.update({
          where: { id },
          data: {
            status: 'EXPIRED',
            isActive: false
          }
        });
      }
    }

    // Check if test exists
    const test = await prisma.test.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: 'asc' },
          include: {
            options: true
          }
        },
        createdBy: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });

    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    // Check permissions
    if (role === 'ADMIN') {
      // Admin must be the creator of the test
      if (test.createdById !== userId) {
        return res.status(403).json({ message: 'Access denied. You can only view tests you created.' });
      }
    } else {
      // For students:
      // 1. Test must be active
      if (!test.isActive && !test.isPublished) {
        return res.status(403).json({ message: 'This test is not available.' });
      }
      
      // 2. Test must not be expired
      if (test.status === 'EXPIRED' && !test.isPublished) {
        return res.status(403).json({ message: 'This test has expired.' });
      }
      
      // 3. Student must be enrolled in a class that has this test assigned
      const studentHasAccess = await prisma.testClass.findFirst({
        where: {
          testId: id,
          class: {
            enrollments: {
              some: {
                userId,
                status: 'APPROVED'
              }
            }
          }
        }
      });
      
      if (!studentHasAccess) {
        return res.status(403).json({ message: 'You do not have access to this test. Please ensure you are enrolled in a class that has this test assigned.' });
      }

      // For students, don't show correct answers unless the test is published
      if (!test.isPublished) {
        test.questions.forEach(question => {
          if (question.options) {
            question.options.forEach(option => {
              delete option.isCorrect;
            });
          }
        });
      } else {
        // If test is published, get the student's attempt to mark their answers
        const studentAttempt = await prisma.testAttempt.findFirst({
          where: {
            testId: id,
            userId,
            submittedAt: { not: null }
          },
          include: {
            answers: true
          },
          orderBy: {
            submittedAt: 'desc'
          }
        });

        if (studentAttempt) {
          // Mark student's answers in the response
          test.questions.forEach(question => {
            const studentAnswers = studentAttempt.answers.filter(a => a.questionId === question.id);
            
            if (question.options) {
              question.options.forEach(option => {
                // Mark if this option was selected by the student
                option.isSelected = studentAnswers.some(a => a.optionId === option.id);
              });
            }
            
            // For text/coding questions, include student's answer
            if (studentAnswers.length > 0 && (question.type === 'TEXT' || question.type === 'CODING')) {
              question.studentAnswer = studentAnswers[0].textAnswer || studentAnswers[0].codeAnswer;
            }
          });
          
          // Include the student's score
          test.studentScore = studentAttempt.score;
        }
      }
    }

    res.json(test);
  } catch (error) {
    console.error('Get test error:', error);
    res.status(500).json({ message: 'Server error while fetching test' });
  }
};

// Update test
export const updateTest = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, 
      description, 
      duration, 
      questions, 
      startTime, 
      endTime, 
      isActive,
      maxAttempts,
      expiryDuration,
      expiryUnit
    } = req.body;

    // Check if test exists
    const existingTest = await prisma.test.findUnique({
      where: { id }
    });

    if (!existingTest) {
      return res.status(404).json({ message: 'Test not found' });
    }

    // Update test and questions in a transaction
    const updatedTest = await prisma.$transaction(async (prisma) => {
      // Update test
      const test = await prisma.test.update({
        where: { id },
        data: {
          title,
          description,
          duration: duration || existingTest.duration,
          startTime: startTime ? new Date(startTime) : existingTest.startTime,
          endTime: endTime ? new Date(endTime) : existingTest.endTime,
          isActive: isActive !== undefined ? isActive : existingTest.isActive,
          maxAttempts: maxAttempts === -1 ? 20 : (maxAttempts !== undefined ? maxAttempts : existingTest.maxAttempts),
          expiryDuration: expiryDuration !== undefined ? expiryDuration : existingTest.expiryDuration,
          expiryUnit: expiryUnit || existingTest.expiryUnit
        }
      });

      // If questions are provided, update them
      if (questions && questions.length > 0) {
        // Delete existing questions and options
        await prisma.question.deleteMany({
          where: { testId: id }
        });

        // Create new questions and options
        for (let i = 0; i < questions.length; i++) {
          const question = questions[i];
          
          // Create question
          const newQuestion = await prisma.question.create({
            data: {
              testId: id,
              text: question.text,
              type: question.type,
              required: question.required || false,
              order: i + 1
            }
          });

          // Create options for MCQ and checkbox questions
          if ((question.type === 'MCQ' || question.type === 'CHECKBOX') && 
              question.options && question.options.length > 0) {
            for (const option of question.options) {
              await prisma.option.create({
                data: {
                  questionId: newQuestion.id,
                  text: option.text,
                  isCorrect: option.isCorrect || false
                }
              });
            }
          }
        }
      }

      return test;
    });

    res.json({
      message: 'Test updated successfully',
      test: updatedTest
    });
  } catch (error) {
    console.error('Update test error:', error);
    res.status(500).json({ message: 'Server error while updating test' });
  }
};

// Delete test
export const deleteTest = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if test exists
    const existingTest = await prisma.test.findUnique({
      where: { id }
    });

    if (!existingTest) {
      return res.status(404).json({ message: 'Test not found' });
    }

    // Delete test (cascade will delete questions and options)
    await prisma.test.delete({
      where: { id }
    });

    res.json({ message: 'Test deleted successfully' });
  } catch (error) {
    console.error('Delete test error:', error);
    res.status(500).json({ message: 'Server error while deleting test' });
  }
};

// Publish test
export const publishTest = async (req, res) => {
  try {
    const { id } = req.params;
    const { startTime, endTime } = req.body;

    // Check if test exists
    const existingTest = await prisma.test.findUnique({
      where: { id },
      include: {
        questions: true
      }
    });

    if (!existingTest) {
      return res.status(404).json({ message: 'Test not found' });
    }

    // Validate test has questions
    if (!existingTest.questions || existingTest.questions.length === 0) {
      return res.status(400).json({ message: 'Cannot publish a test with no questions' });
    }

    // Update test
    const updatedTest = await prisma.test.update({
      where: { id },
      data: {
        isPublished: true,
        status: "COMPLETE", // Set status to Complete when published
        startTime: startTime ? new Date(startTime) : new Date(),
        endTime: endTime ? new Date(endTime) : null
      }
    });

    res.json({
      message: 'Test published successfully',
      test: updatedTest
    });
  } catch (error) {
    console.error('Publish test error:', error);
    res.status(500).json({ message: 'Server error while publishing test' });
  }
};

// Start test attempt
export const startTest = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, id: userId } = req.user;
    const now = new Date();

    // Check if the test should be activated based on start time
    await prisma.test.updateMany({
      where: {
        id,
        startTime: { lte: now },
        isActive: false
      },
      data: {
        isActive: true
      }
    });
    
    // Check if the test has expired based on end time
    await prisma.test.updateMany({
      where: {
        id,
        endTime: { lte: now },
        status: { not: 'COMPLETE' },
        isPublished: false
      },
      data: {
        status: 'EXPIRED',
        isActive: false
      }
    });
    
    // Get the test to check if it has expired based on expiryDuration
    const testWithExpiry = await prisma.test.findUnique({
      where: { id },
      select: {
        expiryDuration: true,
        expiryUnit: true,
        createdAt: true,
        status: true,
        isPublished: true
      }
    });
    
    if (testWithExpiry && 
        testWithExpiry.expiryDuration && 
        testWithExpiry.status !== 'COMPLETE' && 
        !testWithExpiry.isPublished) {
      
      const expiryDate = new Date(testWithExpiry.createdAt);
      
      if (testWithExpiry.expiryUnit === 'minutes') {
        expiryDate.setMinutes(expiryDate.getMinutes() + testWithExpiry.expiryDuration);
      } else if (testWithExpiry.expiryUnit === 'hours') {
        expiryDate.setHours(expiryDate.getHours() + testWithExpiry.expiryDuration);
      } else {
        // Default to days
        expiryDate.setDate(expiryDate.getDate() + testWithExpiry.expiryDuration);
      }
      
      if (now > expiryDate) {
        await prisma.test.update({
          where: { id },
          data: {
            status: 'EXPIRED',
            isActive: false
          }
        });
      }
    }

    // Check if test exists and is active
    const test = await prisma.test.findUnique({
      where: { 
        id,
        OR: [
          { isActive: true },
          { isPublished: true }
        ]
      }
    });

    if (!test) {
      return res.status(404).json({ message: 'Test not found or not available' });
    }
    
    // Check if test is expired
    if (test.status === 'EXPIRED' && !test.isPublished) {
      return res.status(400).json({ message: 'This test has expired and is no longer available' });
    }

    // Check if test is within the scheduled time
    
    // Check if test has a scheduled start time and hasn't started yet
    if (test.startTime && new Date(test.startTime) > now) {
      const startTime = new Date(test.startTime);
      return res.status(400).json({ 
        message: `This test will be available on ${startTime.toLocaleDateString()} at ${startTime.toLocaleTimeString()}`,
        startTime: test.startTime
      });
    }
    
    if (test.endTime && new Date(test.endTime) < now && !test.isPublished) {
      return res.status(400).json({ message: 'Test has already ended' });
    }

    // For students, check if they have access to this test through a class
    if (role !== 'ADMIN') {
      const studentHasAccess = await prisma.testClass.findFirst({
        where: {
          testId: id,
          class: {
            enrollments: {
              some: {
                userId,
                status: 'APPROVED'
              }
            }
          }
        }
      });
      
      if (!studentHasAccess) {
        return res.status(403).json({ message: 'You do not have access to this test. Please ensure you are enrolled in a class that has this test assigned.' });
      }
    }

    // Check if user already has a completed attempt and if results are published
    const completedAttempt = await prisma.testAttempt.findFirst({
      where: {
        testId: id,
        userId,
        submittedAt: { not: null }
      },
      include: {
        test: {
          select: {
            isPublished: true
          }
        }
      }
    });

    if (completedAttempt && completedAttempt.test.isPublished) {
      return res.status(403).json({ 
        message: 'You have already completed this test and results have been published. No further attempts allowed.',
        status: 'COMPLETED'
      });
    }

    // Check attempt limits
    const attemptCount = await prisma.testAttempt.count({
      where: {
        testId: id,
        userId
      }
    });

    // If maxAttempts is 20 (our unlimited value), unlimited attempts are allowed
    // Otherwise, check if the user has reached the maximum number of attempts
    if (test.maxAttempts !== 20 && attemptCount >= test.maxAttempts) {
      return res.status(403).json({ 
        message: `You have reached the maximum number of attempts (${test.maxAttempts}) for this test.`,
        status: 'MAX_ATTEMPTS_REACHED'
      });
    }

    // Check if user already has an active attempt
    const existingAttempt = await prisma.testAttempt.findFirst({
      where: {
        testId: id,
        userId,
        submittedAt: null
      }
    });

    if (existingAttempt) {
      return res.json({
        message: 'Continuing existing test attempt',
        attempt: existingAttempt
      });
    }

    // Create new attempt
    const attempt = await prisma.testAttempt.create({
      data: {
        testId: id,
        userId,
        startedAt: now
      }
    });

    res.status(201).json({
      message: 'Test attempt started',
      attempt
    });
  } catch (error) {
    console.error('Start test error:', error);
    res.status(500).json({ message: 'Server error while starting test' });
  }
};

// Submit test
export const submitTest = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers } = req.body;
    const userId = req.user.id;

    // Find the active attempt
    const attempt = await prisma.testAttempt.findFirst({
      where: {
        testId: id,
        userId,
        submittedAt: null
      }
    });

    if (!attempt) {
      return res.status(404).json({ message: 'No active test attempt found' });
    }

    // Get test with questions and correct answers
    const test = await prisma.test.findUnique({
      where: { id },
      include: {
        questions: {
          include: {
            options: true
          }
        }
      }
    });

    // Process answers and calculate score
    let totalQuestions = test.questions.length;
    let correctAnswers = 0;

    // Submit answers in a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Group answers by questionId for checkbox questions
      const answersByQuestion = {};
      
      // Save answers and group them by questionId
      if (answers && answers.length > 0) {
        for (const answer of answers) {
          // Save each answer
          await prisma.answer.create({
            data: {
              testAttemptId: attempt.id,
              questionId: answer.questionId,
              optionId: answer.optionId,
              textAnswer: answer.textAnswer,
              codeAnswer: answer.codeAnswer
            }
          });
          
          // Group answers by questionId for scoring
          if (!answersByQuestion[answer.questionId]) {
            answersByQuestion[answer.questionId] = [];
          }
          answersByQuestion[answer.questionId].push(answer);
        }
      }
      
      // Score each question
      for (const question of test.questions) {
        const questionAnswers = answersByQuestion[question.id] || [];
        
        if (question.type === 'MCQ' && questionAnswers.length > 0) {
          // For MCQ, check if the selected option is correct
          const answer = questionAnswers[0]; // Only one answer per MCQ question
          const correctOption = question.options.find(o => o.isCorrect);
          if (correctOption && answer.optionId === correctOption.id) {
            correctAnswers++;
          }
        } else if (question.type === 'CHECKBOX') {
          // For checkbox, get all selected optionIds
          const selectedOptionIds = questionAnswers.map(a => a.optionId).filter(Boolean);
          const correctOptionIds = question.options.filter(o => o.isCorrect).map(o => o.id);
          
          // Check if all correct options are selected and no incorrect options
          const allCorrectSelected = correctOptionIds.every(id => selectedOptionIds.includes(id));
          const noIncorrectSelected = selectedOptionIds.every(id => correctOptionIds.includes(id));
          
          if (allCorrectSelected && noIncorrectSelected && selectedOptionIds.length > 0) {
            correctAnswers++;
          }
        }
        // Text and coding questions are not automatically scored
      }

      // Calculate score (as percentage)
      const score = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

      // Update attempt with submission time and score
      const updatedAttempt = await prisma.testAttempt.update({
        where: { id: attempt.id },
        data: {
          submittedAt: new Date(),
          score
        }
      });

      return {
        attempt: updatedAttempt,
        totalQuestions,
        correctAnswers,
        score
      };
    });

    res.json({
      message: 'Test submitted successfully',
      result
    });
  } catch (error) {
    console.error('Submit test error:', error);
    res.status(500).json({ message: 'Server error while submitting test' });
  }
};

// Get test results
export const getTestResults = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { role } = req.user;

    // Find the completed attempt
    const attempt = await prisma.testAttempt.findFirst({
      where: {
        testId: id,
        userId,
        submittedAt: { not: null }
      },
      include: {
        answers: {
          include: {
            question: {
              include: {
                options: true
              }
            }
          }
        },
        test: {
          select: {
            title: true,
            description: true,
            duration: true,
            isPublished: true,
            endTime: true
          }
        }
      },
      orderBy: {
        submittedAt: 'desc'
      }
    });

    if (!attempt) {
      return res.status(404).json({ message: 'No completed test attempt found' });
    }

    // For students, check if results are published
    if (role !== 'ADMIN') {
      // If test results are not published, return an error
      if (!attempt.test.isPublished) {
        return res.status(403).json({ 
          message: 'Test results have not been released by your teacher yet.',
          status: 'PENDING'
        });
      }
      
      const now = new Date();
      const testEnded = attempt.test.endTime && new Date(attempt.test.endTime) < now;
      
      // Don't show correct answers unless the test is over
      if (!testEnded) {
        attempt.answers.forEach(answer => {
          if (answer.question.options) {
            answer.question.options.forEach(option => {
              delete option.isCorrect;
            });
          }
        });
      }
    }

    // Add status to the response
    const response = {
      ...attempt,
      status: 'COMPLETED'
    };

    res.json(response);
  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({ message: 'Server error while fetching results' });
  }
};

// Get all test attempts (admin only)
export const getAllTestAttempts = async (req, res) => {
  try {
    const { role } = req.user;
    
    // Only admins can access all test attempts
    if (role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }
    
    // Get all test attempts with user and test information
    const attempts = await prisma.testAttempt.findMany({
      where: {
        submittedAt: { not: null } // Only completed attempts
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profile: true
          }
        },
        test: {
          select: {
            id: true,
            title: true,
            description: true,
            duration: true
          }
        }
      },
      orderBy: {
        submittedAt: 'desc'
      }
    });
    
    // Format the response
    const formattedAttempts = attempts.map(attempt => ({
      id: attempt.id,
      testId: attempt.testId,
      userId: attempt.userId,
      startedAt: attempt.startedAt,
      submittedAt: attempt.submittedAt,
      score: attempt.score,
      test: attempt.test,
      user: {
        id: attempt.user.id,
        firstName: attempt.user.firstName,
        lastName: attempt.user.lastName,
        email: attempt.user.email,
        rollNumber: attempt.user.profile?.rollNumber || '',
        class: attempt.user.profile?.class || '',
        batch: attempt.user.profile?.batch || '',
        group: attempt.user.profile?.batch || '' // Using batch as group for compatibility
      }
    }));
    
    res.json(formattedAttempts);
  } catch (error) {
    console.error('Get all test attempts error:', error);
    res.status(500).json({ message: 'Server error while fetching test attempts' });
  }
};

// Get user's own test attempts
export const getUserTestAttempts = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user's test attempts with test information
    const attempts = await prisma.testAttempt.findMany({
      where: {
        userId,
        submittedAt: { not: null }, // Only completed attempts
        test: {
          isPublished: true // Only return attempts for tests that have results published
        }
      },
      include: {
        test: {
          select: {
            id: true,
            title: true,
            description: true,
            duration: true
          }
        }
      },
      orderBy: {
        submittedAt: 'desc'
      }
    });
    
    // Format the response
    const formattedAttempts = attempts.map(attempt => ({
      id: attempt.id,
      testId: attempt.testId,
      startedAt: attempt.startedAt,
      submittedAt: attempt.submittedAt,
      score: attempt.score,
      test: attempt.test
    }));
    
    res.json(formattedAttempts);
  } catch (error) {
    console.error('Get user test attempts error:', error);
    res.status(500).json({ message: 'Server error while fetching user test attempts' });
  }
}; 
