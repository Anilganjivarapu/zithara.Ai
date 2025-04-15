import React from 'react';
import { 
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Divider,
  Button
} from '@mui/material';
import {
  Person as PersonIcon,
  Chat as ChatIcon
} from '@mui/icons-material';

const RecentChats = () => {
  // Sample data - replace with API call
  const chats = [
    { id: 1, user: 'John Doe', message: 'Hello, I have a question about my order...', time: '10 min ago' },
    { id: 2, user: 'Jane Smith', message: 'When will my package arrive?', time: '25 min ago' },
    { id: 3, user: 'Robert Johnson', message: 'Need help with product selection', time: '1 hour ago' },
    { id: 4, user: 'Emily Davis', message: 'Issue with my payment method', time: '2 hours ago' }
  ];

  return (
    <Card>
      <CardHeader 
        title="Recent Chats"
        titleTypographyProps={{ variant: 'h6' }}
        action={
          <Button 
            size="small" 
            color="primary"
            startIcon={<ChatIcon />}
          >
            View All
          </Button>
        }
      />
      <CardContent>
        <List>
          {chats.map((chat, index) => (
            <React.Fragment key={chat.id}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={chat.user}
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {chat.message}
                      </Typography>
                      <br />
                      {chat.time}
                    </>
                  }
                />
              </ListItem>
              {index < chats.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default RecentChats;
