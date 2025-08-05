// src/components/Ebooks/EbooksList.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Search,
  Download,
  MenuBook,
  PictureAsPdf,
  Info,
  Folder
} from '@mui/icons-material';
import ebooksService, { Ebook } from '../../../services/ebooks.service';

interface EbooksListProps {
  folderName?: string;
  showSearch?: boolean;
  maxItems?: number;
}

const EbooksList: React.FC<EbooksListProps> = ({ 
  folderName = 'ALL FINAL EBOOKS', 
  showSearch = true,
  maxItems 
}) => {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [filteredEbooks, setFilteredEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEbook, setSelectedEbook] = useState<Ebook | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  // Fetch ebooks on component mount
  useEffect(() => {
    fetchEbooks();
  }, [folderName]);

  // Filter ebooks when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredEbooks(maxItems ? ebooks.slice(0, maxItems) : ebooks);
    } else {
      const filtered = ebooks.filter(ebook =>
        ebook.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEbooks(maxItems ? filtered.slice(0, maxItems) : filtered);
    }
  }, [searchTerm, ebooks, maxItems]);

  const fetchEbooks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let fetchedEbooks: Ebook[];
      
      if (folderName === 'ALL FINAL EBOOKS') {
        fetchedEbooks = await ebooksService.getAllEbooks();
      } else {
        fetchedEbooks = await ebooksService.getEbooksByFolder(folderName);
      }
      
      setEbooks(fetchedEbooks);
      setFilteredEbooks(maxItems ? fetchedEbooks.slice(0, maxItems) : fetchedEbooks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch ebooks');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (ebook: Ebook) => {
    setDownloading(ebook.id);
    
    try {
      await ebooksService.downloadEbook(ebook.id, ebook.name);
    } catch (err) {
      setError(`Failed to download ${ebook.name}`);
    } finally {
      setDownloading(null);
    }
  };

  const handleSearch = async () => {
    if (searchTerm.trim() === '') {
      fetchEbooks();
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const searchResults = await ebooksService.searchEbooks(searchTerm);
      setEbooks(searchResults);
      setFilteredEbooks(maxItems ? searchResults.slice(0, maxItems) : searchResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search ebooks');
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (extension: string) => {
    switch (extension.toLowerCase()) {
      case 'pdf':
        return <PictureAsPdf color="error" />;
      case 'epub':
      case 'mobi':
      case 'azw':
      case 'azw3':
        return <MenuBook color="primary" />;
      default:
        return <MenuBook color="action" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    return ebooksService.formatFileSize(bytes);
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h2">
          <Folder sx={{ mr: 1, verticalAlign: 'middle' }} />
          Ebooks Library
        </Typography>
        <Chip 
          label={`${filteredEbooks.length} ebook${filteredEbooks.length !== 1 ? 's' : ''}`} 
          color="primary" 
          variant="outlined" 
        />
      </Box>

      {/* Search */}
      {showSearch && (
        <Box mb={3}>
          <TextField
            fullWidth
            placeholder="Search ebooks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Button 
                    onClick={handleSearch}
                    disabled={loading}
                    size="small"
                  >
                    Search
                  </Button>
                </InputAdornment>
              )
            }}
          />
        </Box>
      )}

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Loading */}
      {loading && (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      )}

      {/* Ebooks Grid */}
      {!loading && (
        <Grid container spacing={3}>
          {filteredEbooks.map((ebook) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={ebook.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  '&:hover': {
                    boxShadow: 4
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    {getFileIcon(ebook.extension)}
                    <Typography variant="h6" component="h3" sx={{ ml: 1 }} noWrap>
                      {ebook.name}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Format: {ebook.extension.toUpperCase()}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Size: {formatFileSize(ebook.size)}
                  </Typography>
                  
                  <Typography variant="caption" color="text.secondary">
                    Added: {new Date(ebook.createdAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
                
                <CardActions>
                  <Button
                    size="small"
                    startIcon={downloading === ebook.id ? <CircularProgress size={16} /> : <Download />}
                    onClick={() => handleDownload(ebook)}
                    disabled={downloading === ebook.id}
                    variant="contained"
                    fullWidth
                  >
                    {downloading === ebook.id ? 'Downloading...' : 'Download'}
                  </Button>
                  
                  <IconButton
                    size="small"
                    onClick={() => setSelectedEbook(ebook)}
                  >
                    <Info />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* No Results */}
      {!loading && filteredEbooks.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No ebooks found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm ? 'Try adjusting your search terms' : 'No ebooks available in this folder'}
          </Typography>
        </Box>
      )}

      {/* Ebook Details Dialog */}
      <Dialog 
        open={!!selectedEbook} 
        onClose={() => setSelectedEbook(null)} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>
          Ebook Details
        </DialogTitle>
        <DialogContent>
          {selectedEbook && (
            <List>
              <ListItem>
                <ListItemText 
                  primary="Name" 
                  secondary={selectedEbook.name} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Format" 
                  secondary={selectedEbook.extension.toUpperCase()} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="File Size" 
                  secondary={formatFileSize(selectedEbook.size)} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Created" 
                  secondary={new Date(selectedEbook.createdAt).toLocaleString()} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Last Modified" 
                  secondary={new Date(selectedEbook.updatedAt).toLocaleString()} 
                />
              </ListItem>
              {selectedEbook.path && (
                <ListItem>
                  <ListItemText 
                    primary="File Path" 
                    secondary={selectedEbook.path} 
                  />
                </ListItem>
              )}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedEbook(null)}>
            Close
          </Button>
          {selectedEbook && (
            <Button
              variant="contained"
              startIcon={downloading === selectedEbook.id ? <CircularProgress size={16} /> : <Download />}
              onClick={() => handleDownload(selectedEbook)}
              disabled={downloading === selectedEbook.id}
            >
              {downloading === selectedEbook.id ? 'Downloading...' : 'Download'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EbooksList;