import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useClass, useClassTests } from '../../hooks/useClasses';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CircularProgress, 
  Divider, 
  Grid, 
  IconButton, 
  Paper, 
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Chip,
  Tooltip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SchoolIcon from '@mui/icons-material/School';

const ClassDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: classData, isLoading: isClassLoading } = useClass(id);
  const { data: classTests, isLoading: isTestsLoading } = useClassTests(id, {
    refetchInterval: 60000 // Refetch every minute to check for test activation
  });
  
  if (isClassLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (!classData) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" color="error">Class not found</Typography>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/student/classes')}
          sx={{ mt: 2 }}
        >
          Back to Classes
        </Button>
      </Box>
    );
  }
  
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/student/classes')} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          {classData.name}
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Available Tests
            </Typography>
            
            {isTestsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
              </Box>
            ) : classTests && classTests.length > 0 ? (
              <List>
                {/* Upcoming Tests Section */}
                {classTests.some(test => !test.isActive && test.startTime && new Date(test.startTime) > new Date() && test.status !== 'EXPIRED') && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      color: 'info.main',
                      mb: 1
                    }}>
                      <Box component="span" sx={{ 
                        bgcolor: 'info.light', 
                        color: 'info.main', 
                        p: 0.5, 
                        borderRadius: '50%',
                        mr: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 28,
                        height: 28
                      }}>
                        📅
                      </Box>
                      Upcoming Tests
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    {classTests
                      .filter(test => !test.isActive && test.startTime && new Date(test.startTime) > new Date() && test.status !== 'EXPIRED')
                      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
                      .map((test) => (
                        <Paper 
                          key={test.id} 
                          elevation={1} 
                          sx={{ 
                            mb: 2, 
                            overflow: 'hidden',
                            borderLeft: '4px solid',
                            borderColor: 'info.main'
                          }}
                        >
                          <ListItemButton 
                            onClick={() => navigate(`/student/tests/${test.id}`)}
                            sx={{ 
                              p: 2,
                              transition: 'all 0.2s',
                              '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                              }
                            }}
                          >
                            <ListItemIcon>
                              <AssignmentIcon color="info" fontSize="large" />
                            </ListItemIcon>
                            <ListItemText 
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                  <Typography variant="h6" component="div">
                                    {test.title}
                                  </Typography>
                                  <Tooltip title="Test is scheduled for the future">
                                    <Chip 
                                      label="Upcoming" 
                                      color="info" 
                                      size="small" 
                                      sx={{ fontWeight: 'bold' }} 
                                    />
                                  </Tooltip>
                                </Box>
                              }
                              secondary={
                                <Box sx={{ mt: 1 }}>
                                  <Typography variant="body2" color="text.secondary" paragraph>
                                    {test.description || 'No description provided'}
                                  </Typography>
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                      <AccessTimeIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                                      <Typography variant="body2" color="text.secondary">
                                        {test.duration} minutes
                                      </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                      <HelpOutlineIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                                      <Typography variant="body2" color="text.secondary">
                                        {test._count?.questions || 0} questions
                                      </Typography>
                                    </Box>
                                    <Box sx={{ 
                                      display: 'flex', 
                                      alignItems: 'center', 
                                      bgcolor: 'info.light', 
                                      color: 'info.contrastText',
                                      px: 1,
                                      py: 0.5,
                                      borderRadius: 1,
                                      fontSize: '0.75rem'
                                    }}>
                                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                        Scheduled: {new Date(test.startTime).toLocaleDateString()} at {new Date(test.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Box>
                              }
                            />
                            <Button 
                              variant="outlined" 
                              color="info"
                              sx={{ ml: 2 }}
                              disabled={true}
                            >
                              Upcoming
                            </Button>
                          </ListItemButton>
                        </Paper>
                      ))}
                  </Box>
                )}
                
                {/* Active Tests Section */}
                {classTests.some(test => test.isActive && !test.isPublished) && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      color: 'success.main',
                      mb: 1
                    }}>
                      <Box component="span" sx={{ 
                        bgcolor: 'success.light', 
                        color: 'success.main', 
                        p: 0.5, 
                        borderRadius: '50%',
                        mr: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 28,
                        height: 28
                      }}>
                        ✅
                      </Box>
                      Active Tests
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    {classTests
                      .filter(test => test.isActive && !test.isPublished)
                      .map((test) => (
                        <Paper 
                          key={test.id} 
                          elevation={1} 
                          sx={{ 
                            mb: 2, 
                            overflow: 'hidden',
                            borderLeft: '4px solid',
                            borderColor: 'success.main'
                          }}
                        >
                          <ListItemButton 
                            onClick={() => navigate(`/student/tests/${test.id}`)}
                            sx={{ 
                              p: 2,
                              transition: 'all 0.2s',
                              '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                              }
                            }}
                          >
                            <ListItemIcon>
                              <AssignmentIcon color="success" fontSize="large" />
                            </ListItemIcon>
                            <ListItemText 
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                  <Typography variant="h6" component="div">
                                    {test.title}
                                  </Typography>
                                  <Tooltip title="Test is active and available">
                                    <Chip 
                                      label="Active" 
                                      color="success" 
                                      size="small" 
                                      sx={{ fontWeight: 'bold' }} 
                                    />
                                  </Tooltip>
                                </Box>
                              }
                              secondary={
                                <Box sx={{ mt: 1 }}>
                                  <Typography variant="body2" color="text.secondary" paragraph>
                                    {test.description || 'No description provided'}
                                  </Typography>
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                      <AccessTimeIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                                      <Typography variant="body2" color="text.secondary">
                                        {test.duration} minutes
                                      </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                      <HelpOutlineIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                                      <Typography variant="body2" color="text.secondary">
                                        {test._count?.questions || 0} questions
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Box>
                              }
                            />
                            <Button 
                              variant="contained" 
                              color="success"
                              sx={{ ml: 2 }}
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent triggering the parent ListItemButton click
                                navigate(`/student/tests/${test.id}`);
                              }}
                            >
                              Start Test
                            </Button>
                          </ListItemButton>
                        </Paper>
                      ))}
                  </Box>
                )}
                
                {/* Completed Tests Section */}
                {classTests.some(test => test.isPublished) && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      color: 'primary.main',
                      mb: 1
                    }}>
                      <Box component="span" sx={{ 
                        bgcolor: 'primary.light', 
                        color: 'primary.main', 
                        p: 0.5, 
                        borderRadius: '50%',
                        mr: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 28,
                        height: 28
                      }}>
                        🏆
                      </Box>
                      Completed Tests
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    {classTests
                      .filter(test => test.isPublished)
                      .map((test) => (
                  <Paper 
                    key={test.id} 
                    elevation={1} 
                          sx={{ 
                            mb: 2, 
                            overflow: 'hidden',
                            borderLeft: '4px solid',
                            borderColor: 'primary.main'
                          }}
                  >
                    <ListItemButton 
                      onClick={() => navigate(`/student/tests/${test.id}`)}
                      sx={{ 
                        p: 2,
                        transition: 'all 0.2s',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        }
                      }}
                    >
                      <ListItemIcon>
                        <AssignmentIcon color="primary" fontSize="large" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="h6" component="div">
                              {test.title}
                            </Typography>
                                  <Tooltip title="Test is complete and results are available">
                                <Chip 
                                      label="Complete" 
                                      color="primary" 
                                  size="small" 
                                  sx={{ fontWeight: 'bold' }} 
                                />
                              </Tooltip>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" color="text.secondary" paragraph>
                              {test.description || 'No description provided'}
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <AccessTimeIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                  {test.duration} minutes
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <HelpOutlineIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                  {test._count?.questions || 0} questions
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        }
                      />
                      <Button 
                        variant="contained" 
                        color="primary"
                        sx={{ ml: 2 }}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering the parent ListItemButton click
                          navigate(`/student/tests/${test.id}`);
                        }}
                      >
                              View Results
                            </Button>
                          </ListItemButton>
                        </Paper>
                      ))}
                  </Box>
                )}
                
                {/* Expired Tests Section */}
                {classTests.some(test => test.status === 'EXPIRED') && (
                  <Box>
                    <Typography variant="h6" sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      color: 'warning.dark',
                      mb: 1
                    }}>
                      <Box component="span" sx={{ 
                        bgcolor: 'warning.light', 
                        color: 'warning.dark', 
                        p: 0.5, 
                        borderRadius: '50%',
                        mr: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 28,
                        height: 28
                      }}>
                        ⏱️
                      </Box>
                      Expired Tests
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    {classTests
                      .filter(test => test.status === 'EXPIRED')
                      .map((test) => (
                        <Paper 
                          key={test.id} 
                          elevation={1} 
                          sx={{ 
                            mb: 2, 
                            overflow: 'hidden',
                            borderLeft: '4px solid',
                            borderColor: 'warning.dark',
                            opacity: 0.7
                          }}
                        >
                          <ListItemButton 
                            sx={{ 
                              p: 2,
                              transition: 'all 0.2s',
                              '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                              }
                            }}
                          >
                            <ListItemIcon>
                              <AssignmentIcon color="warning" fontSize="large" />
                            </ListItemIcon>
                            <ListItemText 
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                  <Typography variant="h6" component="div">
                                    {test.title}
                                  </Typography>
                                  <Tooltip title="Test has expired and is no longer available">
                                    <Chip 
                                      label="Expired" 
                                      color="warning" 
                                      size="small" 
                                      sx={{ fontWeight: 'bold', bgcolor: '#f59e0b', color: 'white' }} 
                                    />
                                  </Tooltip>
                                </Box>
                              }
                              secondary={
                                <Box sx={{ mt: 1 }}>
                                  <Typography variant="body2" color="text.secondary" paragraph>
                                    {test.description || 'No description provided'}
                                  </Typography>
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                      <AccessTimeIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                                      <Typography variant="body2" color="text.secondary">
                                        {test.duration} minutes
                                      </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                      <HelpOutlineIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                                      <Typography variant="body2" color="text.secondary">
                                        {test._count?.questions || 0} questions
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Box>
                              }
                            />
                            <Button 
                              variant="outlined" 
                              color="warning"
                              sx={{ ml: 2 }}
                              disabled={true}
                            >
                              Expired
                      </Button>
                    </ListItemButton>
                  </Paper>
                ))}
                  </Box>
                )}
                
                {/* Show message if no tests in any category */}
                {!classTests.some(test => 
                  test.isActive || 
                  test.isPublished || 
                  test.status === 'EXPIRED' || 
                  (!test.isActive && test.startTime && new Date(test.startTime) > new Date() && test.status !== 'EXPIRED')
                ) && (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <AssignmentIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      No tests available in this class yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Your teacher hasn't assigned any tests to this class yet.
                    </Typography>
                  </Box>
                )}
              </List>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <AssignmentIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No tests available in this class yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Your teacher hasn't assigned any tests to this class yet.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Class Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Description
                </Typography>
                <Typography variant="body1">
                  {classData.description || 'No description provided'}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Teacher
                </Typography>
                <Typography variant="body1">
                  {classData.createdBy?.firstName} {classData.createdBy?.lastName}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Joined On
                </Typography>
                <Typography variant="body1">
                  {new Date(classData.enrollments?.[0]?.createdAt || classData.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <Chip 
                  label="Enrolled" 
                  color="success" 
                  size="small" 
                  sx={{ mt: 0.5 }} 
                />
              </Box>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Classmates
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {classData.enrollments && classData.enrollments.length > 0 ? (
                <List dense disablePadding>
                  {classData.enrollments.map((enrollment) => (
                    <ListItem key={enrollment.id} disablePadding sx={{ mb: 1 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <PersonIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={`${enrollment.user.firstName} ${enrollment.user.lastName}`}
                        secondary={enrollment.user.profile?.rollNumber || ''}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    No other students enrolled yet
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ClassDetail; 