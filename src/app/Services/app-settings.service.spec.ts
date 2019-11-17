/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AppSettingsService } from './app-settings.service';
import { ElectronService } from 'ngx-electron';
import { SettingsModel } from '../Models/SettingsModel';
import { ConfirmationService } from './confirmation.service';

describe('Service: AppSettings', () => {
  let service: AppSettingsService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AppSettingsService,
        ElectronService,
        ConfirmationService
      ]
    });
    service = TestBed.get(AppSettingsService);
  });

  it('AppSettingsService should be injected', () => {
    expect(service).toBeTruthy();
  });

  it('Electron should not be running', () => {
    expect(service.isElectron()).toBe(false);
  });

  it('getNotes() should initialise NotesPages', () => {
    expect(service.NotesPages).toBeDefined();
    expect(service.NotesPages.length).toBeGreaterThan(0);
  });

  it('selectPage() should throw error', () => {
    // Arrange
    const TESTVAR = 1;
    // Act & Assert
    expect(() => { service.selectPage(TESTVAR); }).toThrow(new Error('Page out of range'));
    expect(() => { service.selectPage(undefined); }).toThrow(new Error('Page out of range'));
    expect(() => { service.selectPage(null); }).toThrow(new Error('Page out of range'));
  });

  it('ResizeTextArea() should throw error', () => {
    // Arrange
    const TESTVAR = 1;
    // Act & Assert
    expect(() => { service.ResizeTextArea(TESTVAR); }).toThrow();
    expect(() => { service.ResizeTextArea(undefined); }).toThrow();
    expect(() => { service.ResizeTextArea(null); }).toThrow();
  });

  it('setNoteFrames() should create/save settings', () => {
    // Arrange
    const EXPECTED = new SettingsModel(service.NotesPages, service.SelectedPage);
    // Act
    service.setNoteFrames();
    service.getNoteFrames();
    const TEST = new SettingsModel(service.NotesPages, service.SelectedPage);
    // Assert
    expect(TEST).toEqual(EXPECTED);
  });

  it('addNewNote() should add a note', () => {
    // Arrange
    const EXPECTED = service.Notes.length + 1;
    // Act
    service.addNewNote();
    // Assert
    expect(service.Notes.length).toEqual(EXPECTED);
  });

  it('deleteNote() should delete a note', () => {
    if (service.Notes.length > 0) {
      // Arrange
      const EXPECTED = service.Notes.length - 1;
      const NOTE_TO_DELETE = service.Notes[0];
      // Act
      service.deleteNote(NOTE_TO_DELETE);
      // Assert
      expect(service.Notes.length).toEqual(EXPECTED);
    } else {
      fail();
    }
  });

  it('addNewPage() should add a page', () => {
    // Arrange
    const EXPECTED = service.NotesPages.length + 1;
    // Act
    service.addNewPage();
    // Assert
    expect(service.NotesPages.length).toEqual(EXPECTED);
  });
});
